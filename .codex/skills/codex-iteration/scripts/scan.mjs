import { spawnSync } from "node:child_process";

const HELP = `
Usage: node .codex/skills/codex-iteration/scripts/scan.mjs [--help]

Fast-signal scan for agent skill health:
- Validates skills (frontmatter + required structure)
- Flags dialect drift (OPUS-/CODEX- trigger prefixes inside runtime SSOT skills)

Options:
  -h, --help  Show this help.

Env:
  MAX_LINES   Max output lines per section (default: 60).

Requires:
  pnpm        Used for 'pnpm -s validate:skills'.
  rg          ripgrep in PATH.
`;

const argv = process.argv.slice(2);
if (argv.includes("-h") || argv.includes("--help")) {
  process.stdout.write(`${HELP.trim()}\n`);
  process.exit(0);
}

function run(cmd, args) {
  const res = spawnSync(cmd, args, { encoding: "utf8", shell: false });
  return { cmd: `${cmd} ${args.join(" ")}`, code: res.status ?? 1, out: res.stdout || "", err: res.stderr || "" };
}

function clipLines(text, maxLines) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  if (lines.length <= maxLines) return text.trimEnd();
  return `${lines.slice(0, maxLines).join("\n")}\n... (${lines.length - maxLines} more lines)`;
}

function section(title, body) {
  return [`## ${title}`, body ? `\n${body}\n` : "\n<no matches>\n"].join("\n");
}

function main() {
  const maxLines = Number(process.env.MAX_LINES || "60");
  const excludeSelf = "!**/codex-iteration/**";

  const checks = [
    {
      title: "Validator (pnpm -s validate:skills)",
      command: () => run("pnpm", ["-s", "validate:skills"]),
    },
    {
      title: "Dialect drift in runtime skills (OPUS-/CODEX- prefixes)",
      command: () =>
        run("rg", ["-n", "--glob", excludeSelf, "\\b(OPUS-|CODEX-)\\b", ".codex/skills"]),
    },
    {
      title: "Runtime skills referencing sandbox agents/ (review)",
      command: () =>
        run("rg", ["-n", "--glob", excludeSelf, "\\bagents/\\b|\\\\agents\\\\", ".codex/skills"]),
    },
  ];

  const parts = ["# Agent skills scan (fast signals)\n"];
  for (const c of checks) {
    const res = c.command();
    const body = clipLines(`${res.out}${res.err}`.trimEnd(), maxLines);
    parts.push(section(`${c.title} (exit ${res.code})`, body));
  }

  process.stdout.write(parts.join("\n"));
}

main();
