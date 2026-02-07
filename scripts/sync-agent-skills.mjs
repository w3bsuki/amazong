import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd());
const sourceSkillsRoot = path.join(repoRoot, ".claude", "skills");
const mirrorSkillsRoot = path.join(repoRoot, ".agents", "skills");

const userHome = process.env.USERPROFILE || process.env.HOME || "";
const codexHome = process.env.CODEX_HOME || "";
const userSkillsRoot = codexHome
  ? path.join(codexHome, "skills")
  : userHome
    ? path.join(userHome, ".codex", "skills")
    : "";

const args = new Set(process.argv.slice(2));
const shouldPrune = args.has("--prune");
const shouldSyncHome = args.has("--home");

function fail(message) {
  process.stderr.write(`\nAgent skills sync failed: ${message}\n`);
  process.exitCode = 1;
}

function listSkillDirs(root) {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copySkill(sourceRoot, targetRoot, skillName) {
  const sourceDir = path.join(sourceRoot, skillName);
  const targetDir = path.join(targetRoot, skillName);
  fs.cpSync(sourceDir, targetDir, { recursive: true, force: true });
}

function removeDirSafe(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
}

function pruneTarget(targetRoot, sourceSkillNames) {
  if (!fs.existsSync(targetRoot)) return [];
  const removed = [];
  const sourceSet = new Set(sourceSkillNames);

  for (const targetName of listSkillDirs(targetRoot)) {
    if (sourceSet.has(targetName)) continue;
    removeDirSafe(path.join(targetRoot, targetName));
    removed.push(targetName);
  }

  return removed;
}

function syncToTarget(sourceRoot, targetRoot, sourceSkillNames, targetLabel) {
  ensureDir(targetRoot);
  for (const skillName of sourceSkillNames) {
    copySkill(sourceRoot, targetRoot, skillName);
    process.stdout.write(`[${targetLabel}] synced ${skillName}\n`);
  }
}

function main() {
  if (!fs.existsSync(sourceSkillsRoot)) {
    fail("Missing source skills folder: .claude/skills");
    return;
  }

  const sourceSkills = listSkillDirs(sourceSkillsRoot);
  if (sourceSkills.length === 0) {
    process.stdout.write("No source skills found in .claude/skills\n");
    return;
  }

  syncToTarget(sourceSkillsRoot, mirrorSkillsRoot, sourceSkills, "repo-agents");

  if (shouldSyncHome) {
    if (!userSkillsRoot) {
      fail("Unable to determine user skills path (set CODEX_HOME or USERPROFILE/HOME).");
      return;
    }
    syncToTarget(sourceSkillsRoot, userSkillsRoot, sourceSkills, "user-codex");
  }

  if (shouldPrune) {
    const removedMirror = pruneTarget(mirrorSkillsRoot, sourceSkills);
    for (const removed of removedMirror) {
      process.stdout.write(`[repo-agents] pruned ${removed}\n`);
    }

    if (shouldSyncHome && userSkillsRoot) {
      const removedUser = pruneTarget(userSkillsRoot, sourceSkills);
      for (const removed of removedUser) {
        process.stdout.write(`[user-codex] pruned ${removed}\n`);
      }
    }
  }

  if (!shouldSyncHome) {
    process.stdout.write("Home sync skipped (pass --home to sync CODEX_HOME/skills).\n");
  }
  process.stdout.write("Agent skills sync complete.\n");
}

main();
