import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const args = new Set(process.argv.slice(2));
const warnOnly = args.has("--warn-only");
const strictRubric = args.has("--strict-rubric");

const repoRoot = path.resolve(process.cwd());
const claudeSkillsRoot = path.join(repoRoot, ".claude", "skills");
const agentsSkillsRoot = path.join(repoRoot, ".agents", "skills");

const errors = new Set();
const warnings = new Set();

function addError(message) {
  errors.add(message);
}

function addWarning(message) {
  warnings.add(message);
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
      error: "Missing YAML frontmatter. SKILL.md must start with '---' and close with '---'.",
    };
  }

  const yaml = match[1].trimEnd();
  const lines = yaml.split("\n");
  const data = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const keyMatch = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(trimmed);
    if (!keyMatch) continue;
    const [, key, rawValue] = keyMatch;
    let value = rawValue.trim();
    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  return { ok: true, data };
}

function listSkillDirs(root) {
  if (!fs.existsSync(root)) return [];
  const entries = fs.readdirSync(root, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => path.join(root, entry.name))
    .sort((a, b) => a.localeCompare(b));
}

function listSkillNames(root) {
  return listSkillDirs(root).map((skillDir) => path.basename(skillDir));
}

function hashFile(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

function scanDocLikePaths(content) {
  const paths = new Set();
  for (const match of content.matchAll(/`(docs\/[^`\s)]+)`/g)) {
    paths.add(match[1]);
  }
  for (const match of content.matchAll(/\[[^\]]*?\]\((docs\/[^)\s]+)\)/g)) {
    paths.add(match[1]);
  }
  return [...paths];
}

function validateRubric(skillName, content) {
  const requiredSections = [
    "When to Apply",
    "When NOT to Apply",
    "Non-Negotiables",
    "References",
  ];

  for (const section of requiredSections) {
    const pattern = new RegExp(`^##\\s+${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "im");
    if (!pattern.test(content)) {
      const msg = `${skillName}: missing rubric section '${section}'`;
      if (strictRubric) addError(msg);
      else addWarning(msg);
    }
  }

  const legacyRefPatterns = [
    /docs-final\//i,
    /\.codex\/project\//i,
    /\.codex\/AGENTS\.md/i,
    /\.codex\/WORKFLOW\.md/i,
  ];

  for (const pattern of legacyRefPatterns) {
    if (pattern.test(content)) {
      const msg = `${skillName}: contains legacy/stale reference pattern '${pattern.source}'`;
      if (strictRubric) addError(msg);
      else addWarning(msg);
    }
  }

  for (const relPath of scanDocLikePaths(content)) {
    const absPath = path.join(repoRoot, relPath);
    if (!fs.existsSync(absPath)) {
      const msg = `${skillName}: docs path not found '${relPath}'`;
      if (strictRubric) addError(msg);
      else addWarning(msg);
    }
  }
}

function validateSkillDir(skillDir) {
  const dirName = path.basename(skillDir);
  const skillMd = path.join(skillDir, "SKILL.md");

  if (!fs.existsSync(skillMd)) {
    addError(`${dirName}: missing SKILL.md`);
    return;
  }

  const content = fs.readFileSync(skillMd, "utf8");
  const fm = parseFrontmatter(content);
  if (!fm.ok) {
    addError(`${dirName}: ${fm.error}`);
    return;
  }

  const name = fm.data.name;
  const description = fm.data.description;

  if (!name) {
    addError(`${dirName}: missing required frontmatter field 'name'`);
  } else if (!isLowercaseHyphenName(name)) {
    addError(
      `${dirName}: invalid 'name' value '${name}' (must be 1-64 chars, lowercase letters/numbers/hyphens)`,
    );
  } else if (name !== dirName) {
    addError(`${dirName}: 'name' must match directory name (found '${name}')`);
  }

  if (!description) {
    addError(`${dirName}: missing required frontmatter field 'description'`);
  } else if (description.length > 1024) {
    addError(`${dirName}: 'description' must be <= 1024 characters`);
  }

  validateRubric(dirName, content);
}

function validateRoot(root) {
  const skillDirs = listSkillDirs(root);
  const display = path.relative(repoRoot, root);
  if (skillDirs.length === 0) {
    process.stdout.write(`No skill directories found under ${display}\n`);
    return;
  }
  process.stdout.write(`Validating ${skillDirs.length} skill(s) under ${display}...\n`);
  for (const skillDir of skillDirs) {
    validateSkillDir(skillDir);
  }
}

function validateMirrorParity() {
  if (!fs.existsSync(claudeSkillsRoot) || !fs.existsSync(agentsSkillsRoot)) return;

  const claudeNames = listSkillNames(claudeSkillsRoot);
  const agentNames = listSkillNames(agentsSkillsRoot);
  const claudeSet = new Set(claudeNames);
  const agentSet = new Set(agentNames);

  for (const name of claudeNames) {
    if (!agentSet.has(name)) {
      addError(`mirror parity: missing '${name}' in .agents/skills`);
    }
  }

  for (const name of agentNames) {
    if (!claudeSet.has(name)) {
      addError(`mirror parity: extra '${name}' found in .agents/skills`);
    }
  }

  for (const name of claudeNames) {
    if (!agentSet.has(name)) continue;
    const claudeSkill = path.join(claudeSkillsRoot, name, "SKILL.md");
    const agentSkill = path.join(agentsSkillsRoot, name, "SKILL.md");
    if (!fs.existsSync(claudeSkill) || !fs.existsSync(agentSkill)) continue;
    if (hashFile(claudeSkill) !== hashFile(agentSkill)) {
      addError(`mirror parity: SKILL.md differs for '${name}' between .claude and .agents`);
    }
  }
}

function main() {
  const roots = [claudeSkillsRoot, agentsSkillsRoot].filter((root) => fs.existsSync(root));
  if (roots.length === 0) {
    process.stdout.write("No skills folders found (.claude/skills or .agents/skills).\n");
    return;
  }

  for (const root of roots) {
    validateRoot(root);
  }
  validateMirrorParity();

  if (warnings.size > 0) {
    process.stdout.write(`\nSkill validation warnings (${warnings.size}):\n`);
    for (const warning of warnings) {
      process.stdout.write(`- ${warning}\n`);
    }
  }

  if (errors.size > 0) {
    if (warnOnly) {
      process.stdout.write(`\nSkill validation encountered ${errors.size} error(s), but --warn-only is enabled.\n`);
      for (const error of errors) {
        process.stdout.write(`- ${error}\n`);
      }
      process.stdout.write("Agent Skills validation passed (warning mode).\n");
      return;
    }

    process.stderr.write(`\nAgent Skills validation failed (${errors.size}):\n`);
    for (const error of errors) {
      process.stderr.write(`- ${error}\n`);
    }
    process.exitCode = 1;
    return;
  }

  process.stdout.write("Agent Skills validation passed.\n");
}

main();
