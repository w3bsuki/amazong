import fs from "node:fs";
import path from "node:path";

const skillRoot = path.resolve(process.cwd(), ".codex", "skills", "treido-structure");

function fail(message) {
  process.stderr.write(`treido-structure: ${message}\n`);
  process.exitCode = 1;
}

function requireFile(relPath) {
  const filePath = path.join(skillRoot, relPath);
  if (!fs.existsSync(filePath)) fail(`missing ${relPath}`);
}

function main() {
  requireFile("SKILL.md");
  requireFile(path.join("references", "00-index.md"));
  requireFile(path.join("scripts", "quick-validate.mjs"));

  if (!process.exitCode) process.stdout.write("OK\n");
}

main();

