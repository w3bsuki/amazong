import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd());
const repoSkillsRoot = path.join(repoRoot, ".codex", "skills");
const claudeSkillsRoot = path.join(repoRoot, ".claude", "skills");

function fail(message) {
  process.stderr.write(`\nAgent Skills validation failed: ${message}\n`);
  process.exitCode = 1;
}

function isLowercaseHyphenName(name) {
  if (typeof name !== "string") return false;
  if (name.length < 1 || name.length > 64) return false;
  if (!/^[a-z0-9-]+$/.test(name)) return false;
  if (name.startsWith("-") || name.endsWith("-")) return false;
  if (name.includes("--")) return false;
  return true;
}

function parseFrontmatter(markdown) {
  const normalized = markdown.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return {
      ok: false,
      error:
        "Missing YAML frontmatter. SKILL.md must start with '---' and close with '---'.",
    };
  }

  const yaml = match[1].trimEnd();
  const lines = yaml.split("\n");
  const data = {};

  /**
   * Very small YAML subset parser for frontmatter:
   * - `key: value` scalars
   * - `key: |` / `key: >` block scalars (indented continuations)
   * - `key:` + `- item` lists
   *
   * This is intentionally not a full YAML implementation; it exists only to
   * reliably extract required fields like `name` and `description` without
   * rejecting common frontmatter styles used across editors.
   */
  let activeKey = null;
  let activeMode = null; // "block" | "list" | null
  let blockIndent = null;
  let blockLines = [];
  let listItems = [];

  function commitActive() {
    if (!activeKey) return { ok: true };
    if (Object.prototype.hasOwnProperty.call(data, activeKey)) {
      return { ok: false, error: `Duplicate YAML key: '${activeKey}'` };
    }

    if (activeMode === "block") {
      data[activeKey] = blockLines.join("\n").trim();
    } else if (activeMode === "list") {
      data[activeKey] = listItems.join(",").trim();
    } else {
      // Should never happen, but keep behavior safe.
      data[activeKey] = "";
    }

    activeKey = null;
    activeMode = null;
    blockIndent = null;
    blockLines = [];
    listItems = [];
    return { ok: true };
  }

  for (const raw of lines) {
    const isBlank = raw.trim().length === 0;
    const isComment = raw.trimStart().startsWith("#");

    if (activeMode === "block") {
      if (isBlank) {
        blockLines.push("");
        continue;
      }
      if (isComment) continue;

      const indentMatch = /^(\s+)(.*)$/.exec(raw);
      if (!indentMatch) {
        const committed = commitActive();
        if (!committed.ok) return committed;
        // Fallthrough to parse this line as a new key.
      } else {
        const [, indent, content] = indentMatch;
        if (blockIndent === null) blockIndent = indent.length;
        if (indent.length < blockIndent) {
          const committed = commitActive();
          if (!committed.ok) return committed;
          // Fallthrough to parse this line as a new key.
        } else {
          blockLines.push(raw.slice(blockIndent));
          continue;
        }
      }
    }

    if (activeMode === "list") {
      if (isBlank || isComment) continue;

      const indentMatch = /^(\s+)(.*)$/.exec(raw);
      if (!indentMatch) {
        const committed = commitActive();
        if (!committed.ok) return committed;
        // Fallthrough to parse this line as a new key.
      } else {
        const [, , content] = indentMatch;
        const itemMatch = /^-\s*(.*)$/.exec(content.trim());
        if (!itemMatch) {
          const committed = commitActive();
          if (!committed.ok) return committed;
          // Fallthrough to parse this line as a new key.
        } else {
          const item = itemMatch[1].trim();
          if (item) listItems.push(item);
          continue;
        }
      }
    }

    // Normal key parsing mode
    if (isBlank || isComment) continue;

    const keyMatch = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(raw.trimEnd());
    if (!keyMatch) {
      // Don't hard-fail on indented/unknown lines; frontmatter in the wild is messy.
      // Only fail for non-indented garbage to keep signal high.
      if (!/^\s+/.test(raw)) {
        return { ok: false, error: `Unrecognized YAML line: '${raw}'` };
      }
      continue;
    }

    const [, key, valueRaw] = keyMatch;
    let value = valueRaw.trim();

    if (value === "|" || value === ">") {
      activeKey = key;
      activeMode = "block";
      blockIndent = null;
      blockLines = [];
      continue;
    }

    if (value.length === 0) {
      activeKey = key;
      activeMode = "list";
      listItems = [];
      continue;
    }

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (Object.prototype.hasOwnProperty.call(data, key)) {
      return { ok: false, error: `Duplicate YAML key: '${key}'` };
    }

    data[key] = value;
  }

  const committed = commitActive();
  if (!committed.ok) return committed;

  return { ok: true, data };
}

function listSkillDirs(root) {
  if (!fs.existsSync(root)) return [];
  const entries = fs.readdirSync(root, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => path.join(root, e.name))
    .sort((a, b) => a.localeCompare(b));
}

function listSkillNames(root) {
  return listSkillDirs(root).map((p) => path.basename(p));
}

function validateSkillDir(skillDir, options = {}) {
  const dirName = path.basename(skillDir);
  const skillMd = path.join(skillDir, "SKILL.md");

  if (!fs.existsSync(skillMd)) {
    fail(`${dirName}: missing SKILL.md`);
    return;
  }

  const content = fs.readFileSync(skillMd, "utf8");
  const fm = parseFrontmatter(content);
  if (!fm.ok) {
    fail(`${dirName}: ${fm.error}`);
    return;
  }

  const name = fm.data.name;
  const description = fm.data.description;

  if (!name) {
    fail(`${dirName}: missing required frontmatter field 'name'`);
  } else if (!isLowercaseHyphenName(name)) {
    fail(`${dirName}: invalid 'name' value '${name}' (must be 1-64 chars, lowercase letters/numbers/hyphens, no leading/trailing hyphen, no '--')`);
  } else if (name !== dirName) {
    fail(`${dirName}: 'name' must match directory name (found '${name}')`);
  }

  if (!description) {
    fail(`${dirName}: missing required frontmatter field 'description'`);
  } else if (description.length < 1 || description.length > 1024) {
    fail(`${dirName}: 'description' must be 1-1024 characters`);
  }
}

function displayPath(p) {
  const rel = path.relative(repoRoot, p);
  return rel.startsWith("..") ? p : rel;
}

function main() {
  const roots = [repoSkillsRoot, claudeSkillsRoot].filter((root) => fs.existsSync(root));
  if (roots.length === 0) {
    process.stdout.write("No repo skills folders found (.codex/skills or .claude/skills).\n");
    return;
  }

  for (const root of roots) {
    const skillDirs = listSkillDirs(root);
    if (skillDirs.length === 0) {
      process.stdout.write(`No skill directories found under ${displayPath(root)}\n`);
      continue;
    }

    process.stdout.write(`Validating ${skillDirs.length} skill(s) under ${displayPath(root)}...\n`);
    for (const d of skillDirs) validateSkillDir(d);
  }

  if (process.exitCode && process.exitCode !== 0) {
    return;
  }

  process.stdout.write("Agent Skills validation passed.\n");
}

main();
