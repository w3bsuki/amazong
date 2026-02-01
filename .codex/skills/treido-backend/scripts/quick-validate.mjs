import fs from "node:fs";
import path from "node:path";

const skillRoot = path.resolve(process.cwd(), ".codex", "skills", "treido-backend");

function fail(message) {
  process.stderr.write(`treido-backend: ${message}\n`);
  process.exitCode = 1;
}

function requireFile(relPath) {
  const p = path.join(skillRoot, relPath);
  if (!fs.existsSync(p)) fail(`missing ${relPath}`);
}

function main() {
  requireFile("SKILL.md");
  requireFile(path.join("references", "00-index.md"));
  requireFile(path.join("references", "nextjs.md"));
  requireFile(path.join("references", "nextjs-server.md"));
  requireFile(path.join("references", "supabase.md"));
  requireFile(path.join("references", "stripe-webhooks.md"));
  requireFile(path.join("references", "validation-and-typescript.md"));
  requireFile(path.join("scripts", "scan.mjs"));

  if (!process.exitCode) process.stdout.write("OK\n");
}

main();

