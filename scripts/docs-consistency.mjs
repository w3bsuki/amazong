import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const TASKS_PATH = path.join(ROOT, "TASKS.md");
const CAPABILITY_MAP_PATH = path.join(ROOT, "docs", "strategy", "CAPABILITY-MAP.md");
const NOW_PATH = path.join(ROOT, "docs", "state", "NOW.md");
const CHECK_MAP_PATH = path.join(ROOT, "docs", "_meta", "capability-task-map.json");

const STATUS_RANK = {
  "Not Started": 0,
  Scaffolded: 1,
  MVP: 2,
  Production: 3,
  Advanced: 4,
};

function parseTaskCompletions(text) {
  const statuses = new Map();
  const pattern = /- \[([ xX])\]\s+\*\*(PH\d-[A-Z0-9]+-\d+):\*\*/g;
  let match = null;
  while ((match = pattern.exec(text)) !== null) {
    const done = match[1].toLowerCase() === "x";
    statuses.set(match[2], done);
  }
  return statuses;
}

function parseCapabilityStatuses(text) {
  const statuses = new Map();
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) continue;

    const cells = trimmed
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());

    if (cells.length < 2) continue;
    if (cells[0] === "Capability") continue;
    if (/^-+$/.test(cells[0])) continue;
    if (!STATUS_RANK.hasOwnProperty(cells[1])) continue;

    statuses.set(cells[0], cells[1]);
  }

  return statuses;
}

function loadCheckMap() {
  if (!fs.existsSync(CHECK_MAP_PATH)) {
    throw new Error(`Missing check map: ${path.relative(ROOT, CHECK_MAP_PATH)}`);
  }
  const parsed = JSON.parse(fs.readFileSync(CHECK_MAP_PATH, "utf8"));
  return parsed.checks ?? [];
}

function validateNowTaskIds(nowText, knownTaskIds, issues) {
  const ids = [...new Set(nowText.match(/PH\d-[A-Z]+-\d+/g) ?? [])];
  for (const id of ids) {
    if (!knownTaskIds.has(id)) {
      issues.push(`[unknown-task-id-in-now] ${id}`);
    }
  }
}

function main() {
  const tasksText = fs.readFileSync(TASKS_PATH, "utf8");
  const capabilityMapText = fs.readFileSync(CAPABILITY_MAP_PATH, "utf8");
  const nowText = fs.readFileSync(NOW_PATH, "utf8");

  const taskCompletions = parseTaskCompletions(tasksText);
  const capabilityStatuses = parseCapabilityStatuses(capabilityMapText);
  const checks = loadCheckMap();
  const issues = [];

  for (const check of checks) {
    const capabilityName = check.capability;
    const tasks = check.tasks ?? [];
    const minStatus = check.minStatus;

    if (!STATUS_RANK.hasOwnProperty(minStatus)) {
      issues.push(`[invalid-min-status] ${capabilityName} -> ${minStatus}`);
      continue;
    }

    for (const taskId of tasks) {
      if (!taskCompletions.has(taskId)) {
        issues.push(`[missing-task-in-tasks-md] ${taskId} (mapped from "${capabilityName}")`);
      }
    }

    const allDone = tasks.length > 0 && tasks.every((taskId) => taskCompletions.get(taskId) === true);
    if (!allDone) continue;

    const currentStatus = capabilityStatuses.get(capabilityName);
    if (!currentStatus) {
      issues.push(`[missing-capability-row] ${capabilityName}`);
      continue;
    }

    if (STATUS_RANK[currentStatus] < STATUS_RANK[minStatus]) {
      issues.push(
        `[status-too-low] "${capabilityName}" is "${currentStatus}" but requires >= "${minStatus}"`,
      );
    }
  }

  validateNowTaskIds(nowText, taskCompletions, issues);

  if (issues.length > 0) {
    console.error(`[docs:consistency] ${issues.length} issue(s) found.`);
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log(
    `[docs:consistency] OK: ${checks.length} capability checks and NOW task references are consistent.`,
  );
}

main();
