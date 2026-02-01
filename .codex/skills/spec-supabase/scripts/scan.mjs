import { spawnSync } from "node:child_process";

const HELP = `
Usage: node .codex/skills/spec-supabase/scripts/scan.mjs [--help]

Fast-signal scan for Supabase hazards (wildcard selects, SSR client usage, cached auth hazards, RLS keywords).

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
      title: "Supabase wildcard selects: select('*')",
      command: () => run("rg", ["-n", "select\\(\\s*\\*\\s*\\)", "app", "lib", "--glob", "*.ts", "--glob", "*.tsx"]),
    },
    {
      title: "Supabase wildcard selects: bare .select()",
      command: () => run("rg", ["-n", "\\.select\\(\\s*\\)", "app", "lib", "--glob", "*.ts", "--glob", "*.tsx"]),
    },
    {
      title: "Admin/service role usage signals (must be server-only)",
      command: () => run("rg", ["-n", "\\bcreateAdminClient\\b|SUPABASE_SERVICE_ROLE_KEY", "app", "components", "lib"]),
    },
    {
      title: "@supabase/ssr usage (context correctness)",
      command: () => run("rg", ["-n", "@supabase/ssr", "app", "lib"]),
    },
    {
      title: "Cached server + auth hazards ('use cache' + cookies/headers/createClient)",
      command: () =>
        run("rg", ["-n", "'use cache'|\"use cache\"|\\b(cookies|headers)\\(|\\bcreateClient\\(", "app", "lib"]),
    },
    {
      title: "Migrations: RLS + policy keywords",
      command: () =>
        run("rg", ["-n", "enable row level security|create policy|alter policy|drop policy|auth\\.uid\\(\\)|security definer", "supabase/migrations"]),
    },
  ];

  const parts = ["# SUPABASE scan (fast signals)\n"];
  for (const c of checks) {
    const res = c.command();
    const body = clipLines(`${res.out}${res.err}`.trimEnd(), maxLines);
    parts.push(section(`${c.title} (exit ${res.code})`, body));
  }

  process.stdout.write(parts.join("\n"));
}

main();


