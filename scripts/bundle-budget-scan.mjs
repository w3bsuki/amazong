import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import zlib from "node:zlib";

const ROOT = process.cwd();
const NEXT_DIR = path.join(ROOT, ".next");
const SERVER_APP_DIR = path.join(NEXT_DIR, "server", "app");
const APP_PATH_ROUTES_MANIFEST = path.join(NEXT_DIR, "app-path-routes-manifest.json");

function parseArgs() {
  const args = process.argv.slice(2);
  const getArgValue = (name, fallback) => {
    const index = args.findIndex((arg) => arg === name);
    if (index < 0) return fallback;
    return args[index + 1] ?? fallback;
  };

  const metric = String(getArgValue("--metric", "gzip"));
  const scope = String(getArgValue("--scope", "extra"));
  const maxKb = Number(getArgValue("--max-kb", 150));
  const top = Number(getArgValue("--top", 25));
  const gate = args.includes("--gate") || String(process.env.FAIL_ON_FINDINGS || "") === "1";

  if (metric !== "gzip" && metric !== "raw") {
    console.error(`[bundle:scan] Invalid --metric "${metric}". Expected "gzip" or "raw".`);
    process.exit(2);
  }

  if (scope !== "extra" && scope !== "total") {
    console.error(`[bundle:scan] Invalid --scope "${scope}". Expected "extra" or "total".`);
    process.exit(2);
  }

  if (!Number.isFinite(maxKb) || maxKb <= 0) {
    console.error(`[bundle:scan] Invalid --max-kb "${maxKb}". Expected a positive number.`);
    process.exit(2);
  }

  if (!Number.isFinite(top) || top <= 0) {
    console.error(`[bundle:scan] Invalid --top "${top}". Expected a positive number.`);
    process.exit(2);
  }

  return { metric, scope, maxKb, top, gate };
}

function walkFiles(rootDir) {
  const results = [];
  const queue = [rootDir];

  while (queue.length > 0) {
    const current = queue.pop();
    if (!current) continue;

    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const absPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(absPath);
      } else {
        results.push(absPath);
      }
    }
  }

  return results;
}

function readJson(absPath) {
  return JSON.parse(fs.readFileSync(absPath, "utf8"));
}

function parseRscManifest(absPath) {
  const text = fs.readFileSync(absPath, "utf8").trim();
  const marker = '__RSC_MANIFEST["';
  const markerIndex = text.indexOf(marker);
  if (markerIndex < 0) return null;

  const routeKeyStart = markerIndex + marker.length;
  const routeKeyEnd = text.indexOf('"]', routeKeyStart);
  if (routeKeyEnd < 0) return null;

  const routeKey = text.slice(routeKeyStart, routeKeyEnd);
  const equalsIndex = text.indexOf("=", routeKeyEnd);
  if (equalsIndex < 0) return null;

  const jsonStart = text.indexOf("{", equalsIndex);
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart < 0 || jsonEnd < 0 || jsonEnd < jsonStart) return null;

  const jsonText = text.slice(jsonStart, jsonEnd + 1);
  const payload = JSON.parse(jsonText);
  return { routeKey, payload };
}

function formatKb(bytes) {
  return Number((bytes / 1024).toFixed(1));
}

function main() {
  const options = parseArgs();

  if (!fs.existsSync(NEXT_DIR)) {
    console.error('[bundle:scan] Missing .next/ build output. Run "pnpm -s build" first.');
    process.exit(2);
  }

  if (!fs.existsSync(SERVER_APP_DIR)) {
    console.error('[bundle:scan] Missing .next/server/app output. Run "pnpm -s build" first.');
    process.exit(2);
  }

  const routeMapping = fs.existsSync(APP_PATH_ROUTES_MANIFEST)
    ? readJson(APP_PATH_ROUTES_MANIFEST)
    : {};

  const manifestFiles = walkFiles(SERVER_APP_DIR).filter((file) =>
    file.endsWith(`${path.sep}page_client-reference-manifest.js`),
  );

  const sizeCache = new Map();
  const getSizes = (relPath) => {
    const abs = path.join(NEXT_DIR, relPath);
    const cached = sizeCache.get(abs);
    if (cached && typeof cached === "object") return cached;

    const rawBytes = fs.statSync(abs).size;
    const gzipBytes = zlib.gzipSync(fs.readFileSync(abs), { level: 9 }).length;
    const value = { rawBytes, gzipBytes };
    sizeCache.set(abs, value);
    return value;
  };

  const rows = [];
  for (const absManifestPath of manifestFiles) {
    const parsed = parseRscManifest(absManifestPath);
    if (!parsed) continue;

    const { routeKey, payload } = parsed;
    const entryKey = `[project]/app${routeKey}`;
    const entryFiles = payload?.entryJSFiles?.[entryKey];
    if (!Array.isArray(entryFiles) || entryFiles.length === 0) continue;

    const unique = [...new Set(entryFiles)];
    let totalRawBytes = 0;
    let totalGzipBytes = 0;
    for (const rel of unique) {
      const sizes = getSizes(rel);
      totalRawBytes += sizes.rawBytes;
      totalGzipBytes += sizes.gzipBytes;
    }

    rows.push({
      route: routeMapping[routeKey] ?? routeKey,
      routeKey,
      entryFiles: unique,
      rawBytes: totalRawBytes,
      rawKb: formatKb(totalRawBytes),
      gzipBytes: totalGzipBytes,
      gzipKb: formatKb(totalGzipBytes),
      fileCount: unique.length,
    });
  }

  let sharedFiles = null;
  for (const row of rows) {
    const files = new Set(row.entryFiles);
    if (!sharedFiles) {
      sharedFiles = files;
      continue;
    }
    for (const file of [...sharedFiles]) {
      if (!files.has(file)) sharedFiles.delete(file);
    }
  }

  const shared = [...(sharedFiles ?? [])];
  let sharedRawBytes = 0;
  let sharedGzipBytes = 0;
  for (const rel of shared) {
    const sizes = getSizes(rel);
    sharedRawBytes += sizes.rawBytes;
    sharedGzipBytes += sizes.gzipBytes;
  }

  for (const row of rows) {
    row.extraRawBytes = Math.max(0, row.rawBytes - sharedRawBytes);
    row.extraGzipBytes = Math.max(0, row.gzipBytes - sharedGzipBytes);
    row.extraRawKb = formatKb(row.extraRawBytes);
    row.extraGzipKb = formatKb(row.extraGzipBytes);
  }

  const metricPrefix = options.metric === "gzip" ? "gzip" : "raw";
  const metricKey = options.scope === "extra" ? `${metricPrefix}Kb` : `${metricPrefix}Kb`;
  const valueKey = options.scope === "extra" ? `extra${metricPrefix === "gzip" ? "GzipKb" : "RawKb"}` : `${metricPrefix}Kb`;

  rows.sort((a, b) => b[valueKey] - a[valueKey]);
  const offenders = rows.filter((row) => row[valueKey] > options.maxKb);

  console.log(
    `[bundle:scan] pages=${rows.length} metric=${options.metric} scope=${options.scope} max_kb=${options.maxKb} offenders=${offenders.length}`,
  );
  console.log(
    `[bundle:scan] shared: files=${shared.length} raw=${formatKb(sharedRawBytes)}KB gzip=${formatKb(sharedGzipBytes)}KB`,
  );

  for (const row of rows.slice(0, options.top)) {
    const value = row[valueKey];
    const flag = value > options.maxKb ? "OVER" : "OK";
    console.log(
      `${flag}\t${value}KB\t(total gzip ${row.gzipKb}KB)\t${row.route}`,
    );
  }

  if (offenders.length > 0) {
    console.log(`[bundle:scan] Offenders (>${options.maxKb}KB ${options.metric} ${options.scope})`);
    for (const row of offenders) {
      console.log(
        `- ${row[valueKey]}KB\t(total gzip ${row.gzipKb}KB)\t${row.route}`,
      );
    }
  }

  if (options.gate && offenders.length > 0) {
    process.exit(1);
  }
}

main();
