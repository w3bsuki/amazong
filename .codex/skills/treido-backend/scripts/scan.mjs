import { spawnSync } from "node:child_process";

function run(cmd, args) {
  const res = spawnSync(cmd, args, { encoding: "utf8", shell: false });
  return { cmd: `${cmd} ${args.join(" ")}`, code: res.status ?? 1, out: res.stdout || "", err: res.stderr || "" };
}

function clipLines(text, maxLines) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  if (lines.length <= maxLines) return text.trimEnd();
  return `${lines.slice(0, maxLines).join("\n")}\n… (${lines.length - maxLines} more lines)`;
}

function section(title, body) {
  return [`## ${title}`, body ? `\n${body}\n` : "\n<no matches>\n"].join("\n");
}

function main() {
  const maxLines = Number(process.env.MAX_LINES || "40");

  const checks = [
    {
      title: "Typecheck (fast correctness signal)",
      command: () => run("pnpm", ["-s", "typecheck"]),
    },
    {
      title: "Type safety suppressions",
      command: () =>
        run("rg", [
          "-n",
          "\\bas any\\b|@ts-ignore|@ts-nocheck|@ts-expect-error|\\b:any\\b|\\bany\\[\\]",
          "app",
          "components",
          "lib",
          "--glob",
          "*.ts",
          "--glob",
          "*.tsx",
        ]),
    },
    {
      title: "Cached server code markers",
      command: () => run("rg", ["-n", "'use cache'|\"use cache\"", "app", "lib"]),
    },
    {
      title: "cookies()/headers() usage (cached hazard)",
      command: () => run("rg", ["-n", "\\b(cookies|headers)\\(", "app", "lib"]),
    },
    {
      title: "Supabase wildcard selects (hot-path smell)",
      command: () => run("rg", ["-n", "select\\(\\s*\\*\\s*\\)", "app", "lib", "--glob", "*.ts", "--glob", "*.tsx"]),
    },
    {
      title: "Migrations + RLS keywords",
      command: () => run("rg", ["-n", "row level security|create policy|alter policy|drop policy", "supabase/migrations"]),
    },
  ];

  const parts = ["# BACKEND scan (fast signals)\n"];
  for (const c of checks) {
    const res = c.command();
    const body = clipLines(`${res.out}${res.err}`.trimEnd(), maxLines);
    parts.push(section(`${c.title} (exit ${res.code})`, body));
  }

  process.stdout.write(parts.join("\n"));
}

main();

