import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd());
const userHome = process.env.USERPROFILE || process.env.HOME || "";
const codexHome = process.env.CODEX_HOME || "";
const userCodexSkills = codexHome
  ? path.join(codexHome, "skills")
  : userHome
    ? path.join(userHome, ".codex", "skills")
    : "";
const userClaudeSkills = userHome ? path.join(userHome, ".claude", "skills") : "";

const skillsRoots = [
  path.join(repoRoot, ".codex", "skills"),
  path.join(repoRoot, ".claude", "skills"),
  path.join(repoRoot, "docs-final", "archive", "folders", ".claude", "skills"),
  userCodexSkills,
  userClaudeSkills,
].filter(Boolean);

const existingRoots = [...new Set(skillsRoots.filter((p) => fs.existsSync(p)))];

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
  if (!normalized.startsWith("---\n")) {
    return { ok: false, error: "Missing YAML frontmatter opening '---' on first line" };
  }

  const endIndex = normalized.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return { ok: false, error: "Missing YAML frontmatter closing '---'" };
  }

  const yaml = normalized.slice(4, endIndex).trimEnd();
  const lines = yaml.split("\n");
  const data = {};

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("#")) continue;

    const match = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line);
    if (!match) {
      return { ok: false, error: `Unrecognized YAML line: '${raw}'` };
    }

    const [, key, valueRaw] = match;
    const value = valueRaw.trim();

    if (Object.prototype.hasOwnProperty.call(data, key)) {
      return { ok: false, error: `Duplicate YAML key: '${key}'` };
    }

    data[key] = value;
  }

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

function validateSkillDir(skillDir) {
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
  if (existingRoots.length === 0) {
    process.stdout.write(`No skills folder found at ${path.relative(repoRoot, skillsRoots[0])}\n`);
    return;
  }

  let validatedAny = false;
  for (const root of existingRoots) {
    const skillDirs = listSkillDirs(root);
    if (skillDirs.length === 0) {
      process.stdout.write(`No skill directories found under ${displayPath(root)}\n`);
      continue;
    }

    validatedAny = true;
    process.stdout.write(`Validating ${skillDirs.length} skill(s) under ${displayPath(root)}...\n`);
    for (const d of skillDirs) validateSkillDir(d);
  }

  if (!validatedAny) return;

  if (process.exitCode && process.exitCode !== 0) {
    return;
  }

  process.stdout.write("Agent Skills validation passed.\n");
}

main();
