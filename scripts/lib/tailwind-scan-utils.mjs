import fs from "node:fs";
import path from "node:path";

export function stripComments(text, ext) {
  if (ext === ".css") {
    return text.replace(/\/\*[\s\S]*?\*\//g, "");
  }

  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

export function stripVariants(token) {
  const parts = token.split(":");
  return parts[parts.length - 1] ?? token;
}

export function cleanToken(raw, { stripJsxAttributePrefix = false } = {}) {
  let token = raw;

  if (stripJsxAttributePrefix) {
    token = token.replace(/^(?:className|class)=/i, "").replace(/^[{\"'`]+/, "");
  }

  return token
    .replace(/^[^A-Za-z0-9]+/, "")
    .replace(/[^A-Za-z0-9\[\]\-/:().%]+$/, "");
}

export function extractTokensFromLine(line, options = undefined) {
  return line
    .split(/\s+/)
    .map((raw) => cleanToken(raw, options))
    .filter(Boolean)
    .map(stripVariants);
}

export function countMatches(text, regex) {
  let count = 0;
  regex.lastIndex = 0;
  while (regex.exec(text)) count++;
  return count;
}

export function writeReport(reportPath, reportLines) {
  try {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, `${reportLines.join("\n")}\n`, "utf8");
  } catch {
    // Best-effort reporting.
  }
}

