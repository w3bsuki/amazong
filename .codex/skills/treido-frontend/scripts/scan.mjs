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
      title: '"use client" boundaries',
      command: () => run("rg", ["-n", "\"use client\"", "app", "components"]),
    },
    {
      title: "Cached server code markers",
      command: () => run("rg", ["-n", "'use cache'|\"use cache\"", "app", "lib"]),
    },
    {
      title: "cookies()/headers() usage",
      command: () => run("rg", ["-n", "\\b(cookies|headers)\\(", "app", "lib"]),
    },
    {
      title: "Route-private boundary drift (imports of app/*)",
      command: () => run("rg", ["-n", "from ['\"]@/app/|from ['\"]\\.{1,2}/.*app/", "components", "lib", "app"]),
    },
    {
      title: "Tailwind rails quick scan (non-failing)",
      command: () => run("pnpm", ["-s", "styles:scan"]),
    },
  ];

  const parts = ["# FRONTEND scan (fast signals)\n"];
  for (const c of checks) {
    const res = c.command();
    const body = clipLines(`${res.out}${res.err}`.trimEnd(), maxLines);
    parts.push(section(`${c.title} (exit ${res.code})`, body));
  }

  process.stdout.write(parts.join("\n"));
}

main();

