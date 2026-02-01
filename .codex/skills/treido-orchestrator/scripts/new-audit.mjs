import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const raw = argv[i];
    if (!raw.startsWith("--")) {
      args._.push(raw);
      continue;
    }

    const eq = raw.indexOf("=");
    if (eq !== -1) {
      const key = raw.slice(2, eq);
      const value = raw.slice(eq + 1);
      args[key] = value;
      continue;
    }

    const key = raw.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      args[key] = next;
      i++;
    } else {
      args[key] = true;
    }
  }
  return args;
}

function localDateStamp(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function slugify(input) {
  const slug = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug.slice(0, 48) || "context";
}

function usage() {
  process.stderr.write(
    [
      "Usage:",
      "  node .codex/skills/treido-orchestrator/scripts/new-audit.mjs --context \"checkout\" [--bundle \"Backend\"] [--goal \"...\"]",
      "",
    ].join("\n"),
  );
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const context = typeof args.context === "string" ? args.context : "";
  if (!context) {
    usage();
    process.exitCode = 2;
    return;
  }

  const date = localDateStamp(new Date());
  const slug = slugify(context);
  const title = context.trim();

  const repoRoot = process.cwd();
  const auditDir = path.join(repoRoot, ".codex", "audit");
  const outPath = path.join(auditDir, `${date}_${slug}.md`);

  if (fs.existsSync(outPath)) {
    process.stderr.write(`Refusing to overwrite existing file: ${outPath}\n`);
    process.exitCode = 1;
    return;
  }

  fs.mkdirSync(auditDir, { recursive: true });

  const bundle = typeof args.bundle === "string" ? args.bundle : "<UI | Backend | Supabase | Full>";
  const goal = typeof args.goal === "string" ? args.goal : "<1–2 lines>";

  const template = [
    `# Audit — ${date} — ${title}`,
    "",
    "## Scope",
    `- Goal: ${goal}`,
    `- Bundle: ${bundle}`,
    "- Files/routes: <short list>",
    "",
    "## <AUDITOR_1>",
    "",
    "### Scope",
    "- Files:",
    "  - <path>",
    "- Lines: n/a",
    "",
    "### Findings",
    "| ID | Severity | File:Line | Issue | Fix |",
    "|----|----------|-----------|-------|-----|",
    "| <AUDITOR_1>-001 | High | <path>:<line> | <what’s wrong> | <minimal fix> |",
    "",
    "### Acceptance Checks",
    "- [ ] <command or observable outcome>",
    "",
    "### Risks",
    "- <dependency/blocker/tradeoff>",
    "",
  ].join("\n");

  fs.writeFileSync(outPath, template, "utf8");
  process.stdout.write(`${path.relative(repoRoot, outPath)}\n`);
}

main();

