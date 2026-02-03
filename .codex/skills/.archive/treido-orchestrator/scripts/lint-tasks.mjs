import fs from "node:fs";

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}

function parseSections(lines) {
  const sections = [];
  let current = { title: "<root>", start: 0, lines: [] };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (!match) {
      current.lines.push({ line, index: i });
      continue;
    }

    sections.push(current);
    current = { title: match[1], start: i, lines: [] };
  }
  sections.push(current);
  return sections;
}

function lintTasks(lines) {
  let openTasks = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!/^- \[[ xX]\] /.test(lines[i])) continue;
    const isOpen = /^- \[ \]/.test(lines[i]);
    if (isOpen) openTasks++;

    const lookahead = [];
    for (let j = i + 1, seen = 0; j < lines.length && seen < 14; j++, seen++) {
      if (/^- \[[ xX]\] /.test(lines[j]) || /^###\s+/.test(lines[j]) || /^##\s+/.test(lines[j])) break;
      lookahead.push(lines[j]);
    }

    const block = lookahead.join("\n");
    const missing = [];
    if (isOpen) {
      if (!/\bOwner:/.test(block)) missing.push("Owner");
      if (!/\bVerify:/.test(block)) missing.push("Verify");
      if (!/\bFiles:/.test(block)) missing.push("Files");
    }

    if (missing.length) {
      fail(`Task missing ${missing.join("/")} near: ${lines[i]}`);
    }
  }

  if (openTasks > 20) fail(`Too many open tasks: ${openTasks} (max 20)`);
}

function lintReadyCount(lines) {
  const sections = parseSections(lines);
  const ready = sections.find((s) => /Ready/i.test(s.title));
  if (!ready) return;

  const readyTasks = ready.lines.filter(({ line }) => /^- \[[ xX]\] /.test(line));
  const readyOpen = readyTasks.filter(({ line }) => /^- \[ \]/.test(line));
  if (readyOpen.length > 15) fail(`Too many Ready tasks: ${readyOpen.length} (max 15)`);
}

function main() {
  const filePath = process.argv[2] || ".codex/TASKS.md";
  if (!fs.existsSync(filePath)) {
    fail(`File not found: ${filePath}`);
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n").split("\n");
  lintTasks(lines);
  lintReadyCount(lines);

  if (!process.exitCode) process.stdout.write("OK\n");
}

main();
