import fs from "node:fs";
import path from "node:path";

const skillRoot = path.resolve(process.cwd(), ".codex", "skills", "treido-frontend");

function fail(message) {
  process.stderr.write(`treido-frontend: ${message}\n`);
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
  requireFile(path.join("references", "tailwind.md"));
  requireFile(path.join("references", "shadcn.md"));
  requireFile(path.join("references", "nextjs-app-router.md"));
  requireFile(path.join("references", "tailwind-v4-tokens.md"));
  requireFile(path.join("references", "shadcn-composition.md"));
  requireFile(path.join("references", "i18n-next-intl.md"));
  requireFile(path.join("references", "ui-craft.md"));
  requireFile(path.join("scripts", "scan.mjs"));

  if (!process.exitCode) process.stdout.write("OK\n");
}

main();

