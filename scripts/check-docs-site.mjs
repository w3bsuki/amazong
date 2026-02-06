import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const contentRoot = path.join(repoRoot, "docs-site", "content");

function runSync() {
  const result = spawnSync(process.execPath, [path.join("scripts", "sync-docs-site.mjs")], {
    cwd: repoRoot,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
    throw new Error("docs:site:sync failed");
  }
}

async function hashContentTree(dirAbs) {
  const hash = crypto.createHash("sha256");

  async function walk(currentAbs) {
    const entries = await fs.readdir(currentAbs, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const abs = path.join(currentAbs, entry.name);
      if (entry.isDirectory()) {
        await walk(abs);
        continue;
      }
      if (!entry.isFile()) continue;
      if (!entry.name.endsWith(".mdx") && !entry.name.endsWith(".js")) continue;

      const rel = path.relative(dirAbs, abs).replaceAll("\\", "/");
      const content = await fs.readFile(abs, "utf8");
      hash.update(rel);
      hash.update("\n");
      hash.update(content);
      hash.update("\n---\n");
    }
  }

  await walk(dirAbs);
  return hash.digest("hex");
}

async function main() {
  runSync();
  const firstHash = await hashContentTree(contentRoot);
  runSync();
  const secondHash = await hashContentTree(contentRoot);

  if (firstHash !== secondHash) {
    process.stderr.write("docs-site check failed: sync output is not deterministic.\n");
    process.exitCode = 1;
    return;
  }

  process.stdout.write("docs-site check passed\n");
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
