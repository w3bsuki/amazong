import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const featuresPath = path.join(repoRoot, "docs", "FEATURES.md");
const prdPath = path.join(repoRoot, "docs", "PRD.md");
const tasksPath = path.join(repoRoot, ".codex", "TASKS.md");
const outPath = path.join(repoRoot, "docs", "status", "LAUNCH-READINESS.yaml");

function readFile(filePath, { optional = false } = {}) {
  if (!fs.existsSync(filePath)) {
    if (optional) return "";
    throw new Error(`Required source file not found: ${path.relative(repoRoot, filePath)}`);
  }
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
}

function parseProgress(featuresMarkdown) {
  const progressMatch = featuresMarkdown.match(/Progress:\s*(\d+)\s*\/\s*(\d+).*?\(\~?(\d+)%\)/i);
  if (!progressMatch) {
    return {
      implemented: 0,
      total: 1,
      percent: 0,
    };
  }

  const implemented = Number(progressMatch[1] ?? 0);
  const total = Number(progressMatch[2] ?? 1);
  const percent = Number(progressMatch[3] ?? 0);

  return {
    implemented,
    total,
    percent,
  };
}

function parseLaunchCriteria(prdMarkdown) {
  const lines = prdMarkdown.split("\n");
  const criteria = [];
  let inSection = false;

  for (const line of lines) {
    if (/^###\s+Launch Criteria/i.test(line.trim())) {
      inSection = true;
      continue;
    }

    if (inSection && /^###\s+/.test(line.trim())) break;
    if (!inSection) continue;

    const match = line.match(/^\s*(\d+)\.\s+(.+)\s*$/);
    if (!match) continue;

    criteria.push({
      id: `LC-${String(match[1]).padStart(2, "0")}`,
      title: match[2].trim(),
    });
  }

  if (criteria.length === 0) {
    criteria.push({
      id: "LC-01",
      title: "Launch criteria section not found in PRD",
    });
  }

  return criteria;
}

function parseReadyTasks(tasksMarkdown) {
  const lines = tasksMarkdown.split("\n");
  const tasks = [];

  let inReady = false;
  let current = null;

  const flush = () => {
    if (!current) return;
    tasks.push(current);
    current = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^##\s+📋\s+Ready/i.test(trimmed)) {
      inReady = true;
      continue;
    }
    if (inReady && /^##\s+/.test(trimmed)) {
      flush();
      break;
    }
    if (!inReady) continue;

    const taskMatch = line.match(/^- \[ \] ([A-Z0-9-]+):\s+(.+)$/);
    if (taskMatch) {
      flush();
      current = {
        id: taskMatch[1].trim(),
        title: taskMatch[2].trim(),
        priority: "Unknown",
        owner: "Unknown",
        audit: "",
      };
      continue;
    }

    if (!current) continue;

    const priorityMatch = line.match(/^\s+-\s+Priority:\s+(.+)$/i);
    if (priorityMatch) {
      current.priority = priorityMatch[1].trim();
      continue;
    }

    const ownerMatch = line.match(/^\s+-\s+Owner:\s+(.+)$/i);
    if (ownerMatch) {
      current.owner = ownerMatch[1].trim();
      continue;
    }

    const auditMatch = line.match(/^\s+-\s+Audit:\s+(.+)$/i);
    if (auditMatch) {
      current.audit = auditMatch[1].trim();
      continue;
    }
  }

  flush();

  return tasks;
}

function classifyOverallStatus(progress, criticalBlockers) {
  if (criticalBlockers.length > 0) return "blocked";
  if (progress.percent >= 95) return "at_risk";
  return "in_progress";
}

function criterionStatusFromContext(criterion, progress, criticalBlockers) {
  if (criticalBlockers.length > 0 && /payout|payment|auth|RLS|security/i.test(criterion.title)) {
    return "blocked";
  }

  if (/P0 features/i.test(criterion.title)) {
    if (progress.percent >= 95) return "ready";
    if (progress.percent >= 85) return "at_risk";
    return "blocked";
  }

  return "unknown";
}

function buildReadiness() {
  const featuresMarkdown = readFile(featuresPath);
  const prdMarkdown = readFile(prdPath);
  const tasksMarkdown = readFile(tasksPath, { optional: true });
  const hasTasksSource = fs.existsSync(tasksPath);
  const canonicalSources = hasTasksSource
    ? ["docs/PRD.md", "docs/FEATURES.md", ".codex/TASKS.md"]
    : ["docs/PRD.md", "docs/FEATURES.md"];

  const progress = parseProgress(featuresMarkdown);
  const criteria = parseLaunchCriteria(prdMarkdown);
  const readyTasks = parseReadyTasks(tasksMarkdown);

  const criticalBlockers = readyTasks
    .filter((task) => /critical/i.test(task.priority))
    .map((task) => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      owner: task.owner,
      ...(task.audit ? { audit: task.audit } : {}),
    }));

  const readinessCriteria = criteria.map((criterion) => ({
    id: criterion.id,
    title: criterion.title,
    status: criterionStatusFromContext(criterion, progress, criticalBlockers),
    evidence: canonicalSources,
    notes: "Status is auto-derived from documented progress and active critical blockers.",
  }));

  const data = {
    meta: {
      generated_at: new Date().toISOString().slice(0, 10),
      version: "1.0.0",
      canonical_sources: canonicalSources,
    },
    readiness: {
      status: classifyOverallStatus(progress, criticalBlockers),
      documented_progress: progress,
      critical_blockers: criticalBlockers,
      criteria: readinessCriteria,
    },
  };

  return `${JSON.stringify(data, null, 2)}\n`;
}

function main() {
  const checkOnly = process.argv.includes("--check");
  const output = buildReadiness();

  if (checkOnly) {
    if (!fs.existsSync(outPath)) {
      process.stderr.write("LAUNCH-READINESS check failed: file does not exist.\n");
      process.exitCode = 1;
      return;
    }

    const current = fs.readFileSync(outPath, "utf8");
    if (current !== output) {
      process.stderr.write(
        "LAUNCH-READINESS check failed: file is out of date. Run `pnpm -s docs:status:build`.\n",
      );
      process.exitCode = 1;
      return;
    }

    process.stdout.write("LAUNCH-READINESS check ok\n");
    return;
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, output, "utf8");
  process.stdout.write(`Wrote ${path.relative(repoRoot, outPath)}\n`);
}

main();
