import { spawnSync } from "node:child_process";

const HELP = `
Usage: node .codex/skills/spec-typescript/scripts/scan.mjs [--help]

Fast-signal ripgrep scan for common TypeScript safety hazards.

Options:
  -h, --help  Show this help.

Env:
  MAX_LINES   Max output lines per section (default: 40).

Requires:
  rg          ripgrep in PATH.
`;

const argv = process.argv.slice(2);
if (argv.includes("-h") || argv.includes("--help")) {
  process.stdout.write(`${HELP.trim()}\n`);
  process.exit(0);
}

function run(cmd, args) {
  const res = spawnSync(cmd, args, { encoding: "utf8", shell: false });
  return {
    cmd: `${cmd} ${args.join(" ")}`,
    code: res.status ?? 1,
    out: res.stdout || "",
    err: res.stderr || "",
  };
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
  const maxLines = Number(process.env.MAX_LINES || "40");

  const targets = ["app", "components", "lib"];
  const tsGlobs = ["--glob", "*.ts", "--glob", "*.tsx"];

  const checks = [
    {
      title: "ts-ignore / ts-nocheck directives",
      command: () =>
        run("rg", ["-n", "@ts-ignore|@ts-nocheck|@ts-expect-error", ...targets, ...tsGlobs]),
    },
    {
      title: "unsafe casts",
      command: () => run("rg", ["-n", "\\bas any\\b|\\bunknown as\\b", ...targets, ...tsGlobs]),
    },
    {
      title: "any usage (signal, not always wrong)",
      command: () => run("rg", ["-n", "\\bany\\b", ...targets, ...tsGlobs]),
    },
    {
      title: "JSON.parse usage (ensure validation)",
      command: () => run("rg", ["-n", "\\bJSON\\.parse\\(", ...targets, ...tsGlobs]),
    },
    {
      title: "client boundary markers",
      command: () => run("rg", ["-n", "\"use client\"", "app", "components"]),
    },
  ];

  const parts = ["# TYPESCRIPT scan (fast signals)\n"];
  for (const c of checks) {
    const res = c.command();
    const body = clipLines(`${res.out}${res.err}`.trimEnd(), maxLines);
    parts.push(section(`${c.title} (exit ${res.code})`, body));
  }

  process.stdout.write(parts.join("\n"));
}

main();

