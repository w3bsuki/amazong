import { spawnSync } from "node:child_process";

const HELP = `
Usage: node .codex/skills/spec-nextjs/scripts/scan.mjs [--help]

Fast-signal ripgrep scan for Next.js App Router / RSC / caching hazards.

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
      title: '"use client" markers',
      command: () => run("rg", ["-n", "\"use client\"", "app", "components"]),
    },
    {
      title: "React hooks in app/ (may require 'use client')",
      command: () =>
        run("rg", [
          "-n",
          "\\b(useState|useEffect|useLayoutEffect|useReducer|useRef|useMemo|useCallback|createContext|useContext)\\b",
          "app",
          "--glob",
          "*.tsx",
        ]),
    },
    {
      title: "Server-only imports (client bundle hazard)",
      command: () =>
        run("rg", ["-n", "from ['\"]next/headers['\"]|from ['\"]next/server['\"]|\\bserver-only\\b", "app", "components", "lib"]),
    },
    {
      title: "Cached server markers",
      command: () => run("rg", ["-n", "'use cache'|\"use cache\"", "app", "lib"]),
    },
    {
      title: "cacheLife/cacheTag/revalidate* usage",
      command: () => run("rg", ["-n", "\\b(cacheLife|cacheTag|revalidateTag|revalidatePath)\\b", "app", "lib"]),
    },
    {
      title: "cookies()/headers() usage (cached hazard)",
      command: () => run("rg", ["-n", "\\b(cookies|headers)\\(", "app", "lib"]),
    },
    {
      title: "next/navigation usage (i18n routing drift signal)",
      command: () => run("rg", ["-n", "from ['\"]next/navigation['\"]", "app", "components"]),
    },
    {
      title: "Route handler signals (app/**/route.ts)",
      command: () =>
        run("rg", ["-n", "\\bNext(Request|Response)\\b|\\bResponse\\.json\\b|\\brequest\\.json\\b", "app", "--glob", "route.ts"]),
    },
    {
      title: "Middleware/proxy signals",
      command: () => run("rg", ["-n", "\\bmiddleware\\.ts\\b|\\bproxy\\.ts\\b", "."]),
    },
  ];

  const parts = ["# NEXTJS scan (fast signals)\n"];
  for (const c of checks) {
    const res = c.command();
    const body = clipLines(`${res.out}${res.err}`.trimEnd(), maxLines);
    parts.push(section(`${c.title} (exit ${res.code})`, body));
  }

  process.stdout.write(parts.join("\n"));
}

main();


