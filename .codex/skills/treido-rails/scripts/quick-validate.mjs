import fs from "node:fs";
import path from "node:path";

const skillRoot = path.resolve(process.cwd(), ".codex", "skills", "treido-rails");

function fail(message) {
  process.stderr.write(`treido-rails: ${message}\n`);
  process.exitCode = 1;
}

function requireFile(relPath) {
  const p = path.join(skillRoot, relPath);
  if (!fs.existsSync(p)) fail(`missing ${relPath}`);
}

function main() {
  requireFile("SKILL.md");
  requireFile(path.join("references", "00-index.md"));

  if (!process.exitCode) process.stdout.write("OK\n");
}

main();
