import { spawnSync } from "node:child_process";

const HELP = `
Usage: node .codex/skills/spec-tailwind/scripts/scan.mjs [--help]

Fast-signal scan for Tailwind v4 rails (tokens, gradients, arbitrary values, palette utilities).

Options:
  -h, --help  Show this help.

Env:
  MAX_LINES   Max output lines per section (default: 40).

Requires:
  pnpm        Used for 'pnpm -s styles:scan'.
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
  const maxLines = Number(process.env.MAX_LINES || "40");

  const checks = [
    {
      title: "Tailwind rails scan scripts (repo SSOT)",
      command: () => run("pnpm", ["-s", "styles:scan"]),
    },
    {
      title: "Gradients (direct grep: bg-gradient-to-*)",
      command: () => run("rg", ["-n", "\\bbg-gradient-to-", "app", "components"]),
    },
    {
      title: "Tailwind bracket arbitrary utilities (class-like grep)",
      command: () =>
        run("rg", [
          "-n",
          "\\b(?:h|w|min-h|min-w|max-h|max-w|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|space-x|space-y|rounded|text|leading|tracking|top|right|bottom|left|inset|translate-x|translate-y|shadow|z)-\\[[^\\]]+\\]",
          "app",
          "components",
        ]),
    },
    {
      title: "Hardcoded colors in code (hex/oklch)",
      command: () => run("rg", ["-n", "#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\\b|\\boklch\\(", "app", "components"]),
    },
    {
      title: "Palette utilities (direct grep)",
      command: () =>
        run("rg", [
          "-n",
          "\\b(bg|text|border|ring|fill|stroke)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}\\b",
          "app",
          "components",
        ]),
    },
    {
      title: "Opacity hacks on base tokens (review)",
      command: () => run("rg", ["-n", "\\b(bg|text|border)-(primary|muted|accent)/\\d{1,3}\\b", "app", "components"]),
    },
  ];

  const parts = ["# TW4 scan (fast signals)\n"];
  for (const c of checks) {
    const res = c.command();
    const body = clipLines(`${res.out}${res.err}`.trimEnd(), maxLines);
    parts.push(section(`${c.title} (exit ${res.code})`, body));
  }

  process.stdout.write(parts.join("\n"));
}

main();


