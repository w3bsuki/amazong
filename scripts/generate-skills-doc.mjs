import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const skillsRoot = path.join(repoRoot, ".codex", "skills");
const outputPath = path.join(repoRoot, "docs", "SKILLS.md");

function parseFrontmatter(markdown) {
  const match = markdown.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return null;
  const out = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.+)$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function listSkills() {
  if (!fs.existsSync(skillsRoot)) return [];
  return fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => {
      const skillDir = path.join(skillsRoot, entry.name);
      const skillMd = path.join(skillDir, "SKILL.md");
      const markdown = fs.existsSync(skillMd) ? fs.readFileSync(skillMd, "utf8") : "";
      const fm = parseFrontmatter(markdown) ?? {};
      return {
        name: fm.name ?? entry.name,
        description: fm.description ?? "No description",
        path: normalizePath(path.relative(repoRoot, skillMd)),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function normalizePath(p) {
  return p.replaceAll("\\", "/");
}

function buildMarkdown(skills) {
  const lines = [];
  lines.push("# SKILLS.md — Treido Skill Fleet");
  lines.push("");
  lines.push("> Canonical skill inventory generated from `.codex/skills/*`.");
  lines.push("");
  lines.push("| Scope | AI skills and routing surfaces |");
  lines.push("|-------|--------------------------------|");
  lines.push("| Audience | AI agents, developers |");
  lines.push("| Type | Reference |");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`## Active Skills (${skills.length})`);
  lines.push("");
  lines.push("| Skill | Description | File |");
  lines.push("|------|-------------|------|");
  for (const skill of skills) {
    lines.push(`| \`${skill.name}\` | ${skill.description} | \`${skill.path}\` |`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Routing");
  lines.push("");
  lines.push("- Start from `docs/AGENT-MAP.md` for intent-to-skill routing.");
  lines.push("- Apply `treido-rails` constraints for all implementation tasks.");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("*Last updated: 2026-02-06*");
  lines.push("");
  return lines.join("\n");
}

function main() {
  const skills = listSkills();
  const markdown = buildMarkdown(skills);
  fs.writeFileSync(outputPath, markdown, "utf8");
  process.stdout.write(`Wrote ${normalizePath(path.relative(repoRoot, outputPath))}\n`);
}

main();
