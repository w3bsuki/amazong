import { spawnSync } from "node:child_process";

function run(label, cmd, args) {
  process.stdout.write(`\n==> ${label}\n`);
  const res = spawnSync(cmd, args, { stdio: "inherit", shell: false });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

function main() {
  run("typecheck", "pnpm", ["-s", "typecheck"]);
  run("lint", "pnpm", ["-s", "lint"]);
  run("styles:gate", "pnpm", ["-s", "styles:gate"]);
  process.stdout.write("\nOK\n");
}

main();

