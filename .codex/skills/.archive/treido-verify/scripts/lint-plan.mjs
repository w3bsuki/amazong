import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

function run(cmd, args) {
  const res = spawnSync(cmd, args, { encoding: "utf8", shell: false });
  return { code: res.status ?? 1, out: res.stdout || "", err: res.stderr || "" };
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}

function findNewestAuditFile(auditDir) {
  if (!fs.existsSync(auditDir)) return null;
  const entries = fs
    .readdirSync(auditDir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(".md") && e.name !== "README.md")
    .map((e) => path.join(auditDir, e.name));

  if (entries.length === 0) return null;
  entries.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  return entries[0];
}

function main() {
  const repoRoot = process.cwd();
  const auditFileArg = process.argv.slice(2).find((a) => a.endsWith(".md") && !a.startsWith("-"));
  const auditFile = auditFileArg || findNewestAuditFile(path.join(repoRoot, ".codex", "audit"));

  const lintTasks = run("node", [".codex/skills/treido-orchestrator/scripts/lint-tasks.mjs"]);
  if (lintTasks.code !== 0) {
    fail("TASKS lint failed.");
    process.stderr.write(lintTasks.out);
    process.stderr.write(lintTasks.err);
  }

  if (auditFile) {
    const rel = path.relative(repoRoot, auditFile);
    const lintAudit = run("node", [".codex/skills/treido-orchestrator/scripts/lint-audit.mjs", rel]);
    if (lintAudit.code !== 0) {
      fail(`Audit lint failed for ${rel}.`);
      process.stderr.write(lintAudit.out);
      process.stderr.write(lintAudit.err);
    }
  } else {
    process.stdout.write("No audit file found to lint (skipping).\n");
  }

  if (!process.exitCode) process.stdout.write("OK\n");
}

main();
