import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd());
const repoSkillsRoot = path.join(repoRoot, ".codex", "skills");

const userHome = process.env.USERPROFILE || process.env.HOME || "";
const codexHome = process.env.CODEX_HOME || "";
const userSkillsRoot = codexHome
  ? path.join(codexHome, "skills")
  : userHome
    ? path.join(userHome, ".codex", "skills")
    : "";

function fail(message) {
  process.stderr.write(`\nAgent skills sync failed: ${message}\n`);
  process.exitCode = 1;
}

function listSkillDirs(root) {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));
}

function main() {
  if (!fs.existsSync(repoSkillsRoot)) {
    fail(`Missing repo skills folder at ${path.relative(repoRoot, repoSkillsRoot)}`);
    return;
  }

  if (!userSkillsRoot) {
    fail("Unable to determine user skills folder (set CODEX_HOME or USERPROFILE/HOME).");
    return;
  }

  fs.mkdirSync(userSkillsRoot, { recursive: true });

  const skillNames = listSkillDirs(repoSkillsRoot);
  if (skillNames.length === 0) {
    process.stdout.write("No repo skills found to sync.\n");
    return;
  }

  for (const skillName of skillNames) {
    const src = path.join(repoSkillsRoot, skillName);
    const dst = path.join(userSkillsRoot, skillName);
    fs.cpSync(src, dst, { recursive: true, force: true });
    process.stdout.write(`Synced ${skillName}\n`);
  }
}

main();
