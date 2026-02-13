import { spawnSync } from "node:child_process";

function runCommand(label, command, args) {
  process.stdout.write(`\n[docs:advisory] ${label}\n`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: false,
  });

  if ((result.status ?? 1) !== 0) {
    process.stdout.write(`[docs:advisory] warning: ${label} failed (non-blocking)\n`);
    return false;
  }

  process.stdout.write(`[docs:advisory] ok: ${label}\n`);
  return true;
}

function main() {
  runCommand("Doc freshness report", process.execPath, ["scripts/check-doc-freshness.mjs", "--days=30"]);
  runCommand("Docs-site determinism", process.execPath, ["scripts/check-docs-site.mjs"]);
  process.stdout.write("\n[docs:advisory] completed (non-blocking)\n");
}

main();
