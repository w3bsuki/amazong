import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const TASKS_PATH = path.join(ROOT, "TASKS.md");
const NOW_PATH = path.join(ROOT, "docs", "state", "NOW.md");

function parseTaskIds(text) {
  const ids = [];
  const pattern = /- \[[ xX]\]\s+\*\*(PH\d-[A-Z0-9]+-\d+):\*\*/g;
  let match = null;
  while ((match = pattern.exec(text)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

function parseNowTaskIds(text) {
  return [...new Set(text.match(/PH\d-[A-Z0-9]+-\d+/g) ?? [])];
}

function findDuplicateIds(ids) {
  const seen = new Set();
  const duplicates = new Set();

  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }

  return [...duplicates].sort();
}

function main() {
  const tasksText = fs.readFileSync(TASKS_PATH, "utf8");
  const nowText = fs.readFileSync(NOW_PATH, "utf8");

  const taskIds = parseTaskIds(tasksText);
  const duplicateTaskIds = findDuplicateIds(taskIds);
  const knownTaskIds = new Set(taskIds);

  const nowTaskIds = parseNowTaskIds(nowText);
  const issues = [];

  if (taskIds.length === 0) {
    issues.push("[no-active-tasks] TASKS.md has no task IDs");
  }

  for (const id of duplicateTaskIds) {
    issues.push(`[duplicate-task-id] ${id}`);
  }

  for (const id of nowTaskIds) {
    if (!knownTaskIds.has(id)) {
      issues.push(`[unknown-task-id-in-now] ${id}`);
    }
  }

  if (issues.length > 0) {
    console.error(`[docs:consistency] ${issues.length} issue(s) found.`);
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log(
    `[docs:consistency] OK: ${taskIds.length} active tasks tracked and NOW task references are valid.`,
  );
}

main();