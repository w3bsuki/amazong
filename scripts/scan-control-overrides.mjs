import fs from "node:fs"
import path from "node:path"

const projectRoot = process.cwd()
const targetDirs = process.argv.slice(2)
const dirs = targetDirs.length ? targetDirs : ["app", "components"]

const includeExt = new Set([".ts", ".tsx", ".js", ".jsx"])

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory()
  } catch {
    return false
  }
}

function walkFiles(dirAbs, out) {
  const entries = fs.readdirSync(dirAbs, { withFileTypes: true })
  for (const ent of entries) {
    const abs = path.join(dirAbs, ent.name)
    if (ent.isDirectory()) {
      if (ent.name === ".next" || ent.name === "node_modules" || ent.name === "dist") continue
      walkFiles(abs, out)
      continue
    }
    if (!ent.isFile()) continue
    const ext = path.extname(ent.name)
    if (!includeExt.has(ext)) continue
    out.push(abs)
  }
}

const checks = [
  {
    id: "button-icon-override",
    message: "Button icon sizes must come from `size` variants, not raw `size-*`/`h-*` class overrides.",
    test: (line) =>
      /<Button/.test(line) &&
      /size="icon(?:-[a-z]+)?"/.test(line) &&
      /className=/.test(line) &&
      /\b(?:size-(?:8|9|10|11|12)|h-(?:9|10|11|12))\b/.test(line),
  },
  {
    id: "button-sm-height-override",
    message: "Button `size=\"sm\"` should not override height with raw `h-*` classes.",
    test: (line) =>
      /<Button/.test(line) &&
      /size="sm"/.test(line) &&
      /className=/.test(line) &&
      /\bh-(?:9|10|11|12)\b/.test(line),
  },
  {
    id: "input-height-override",
    message: "Input height should use the shared input/control tokens (no raw `h-*` override classes).",
    test: (line) =>
      /<Input/.test(line) &&
      /className=/.test(line) &&
      /\bh-(?:9|10|11|12)\b/.test(line),
  },
  {
    id: "select-trigger-height-override",
    message:
      "SelectTrigger height should use `size` variants or control tokens (no raw `h-*` numeric classes).",
    test: (line) =>
      /<SelectTrigger/.test(line) &&
      /className=/.test(line) &&
      /\bh-(?:9|10|11|12)\b/.test(line),
  },
]

const allFiles = []
for (const d of dirs) {
  const abs = path.resolve(projectRoot, d)
  if (!isDirectory(abs)) continue
  walkFiles(abs, allFiles)
}

const findings = []

for (const abs of allFiles) {
  const rel = path.relative(projectRoot, abs).replaceAll("\\", "/")

  let source = ""
  try {
    source = fs.readFileSync(abs, "utf8")
  } catch {
    continue
  }

  const lines = source.split(/\r?\n/)
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? ""
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("//")) continue

    for (const check of checks) {
      if (!check.test(line)) continue
      findings.push({
        file: rel,
        line: index + 1,
        check: check.id,
        message: check.message,
        snippet: trimmed,
      })
    }
  }
}

if (findings.length === 0) {
  console.log("Control override scan passed (no findings).")
  process.exit(0)
}

const reportLines = []
reportLines.push("Control override findings")
reportLines.push("-------------------------")
for (const finding of findings) {
  reportLines.push(`${finding.file}:${finding.line} [${finding.check}]`)
  reportLines.push(`  ${finding.message}`)
  reportLines.push(`  ${finding.snippet}`)
}
reportLines.push("-------------------------")
reportLines.push(`Totals: findings=${findings.length}`)

const reportPath = path.resolve(projectRoot, "cleanup/control-override-scan-report.txt")
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, `${reportLines.join("\n")}\n`, "utf8")

for (const line of reportLines.slice(0, 40)) {
  console.log(line)
}
if (reportLines.length > 40) {
  console.log("...truncated. See full report:", path.relative(projectRoot, reportPath).replaceAll("\\", "/"))
}

if (String(process.env.FAIL_ON_FINDINGS || "") === "1") {
  process.exit(1)
}
