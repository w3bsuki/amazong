import { spawnSync } from "node:child_process";

const HELP = `
Usage: node .codex/skills/spec-shadcn/scripts/scan.mjs [--help]

Fast-signal scan for shadcn/ui boundary drift and composition hazards.

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
      title: "components/ui imports app/* (boundary violation)",
      command: () => run("rg", ["-n", "from ['\"]@/app/|from ['\"]\\.{1,2}/.*app/", "components/ui"]),
    },
    {
      title: "components/ui uses next-intl (boundary violation)",
      command: () => run("rg", ["-n", "\\bnext-intl\\b|\\buseTranslations\\b", "components/ui"]),
    },
    {
      title: "components/ui references Supabase/Stripe (boundary violation)",
      command: () => run("rg", ["-n", "\\b(supabase|createClient|createAdminClient|stripe)\\b", "components/ui"]),
    },
    {
      title: 'components/ui "use client" markers (expected for some Radix wrappers, review size)',
      command: () => run("rg", ["-n", "\"use client\"", "components/ui"]),
    },
    {
      title: "components/ui hook/context usage (review)",
      command: () => run("rg", ["-n", "\\b(createContext|useContext|useEffect|useLayoutEffect)\\b", "components/ui"]),
    },
    {
      title: "Tailwind rails: gradients/arbitrary/palette (components/ui)",
      command: () =>
        run("rg", [
          "-n",
          "\\bbg-gradient-to-|\\b(?:h|w|min-h|min-w|max-h|max-w|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|space-x|space-y|rounded|text|leading|tracking|top|right|bottom|left|inset|translate-x|translate-y|shadow|z)-\\[[^\\]]+\\]|\\b(bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}\\b",
          "components/ui",
        ]),
    },
  ];

  const parts = ["# SHADCN scan (fast signals)\n"];
  for (const c of checks) {
    const res = c.command();
    const body = clipLines(`${res.out}${res.err}`.trimEnd(), maxLines);
    parts.push(section(`${c.title} (exit ${res.code})`, body));
  }

  process.stdout.write(parts.join("\n"));
}

main();

