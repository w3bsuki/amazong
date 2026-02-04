import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import ts from "typescript";

const repoRoot = path.resolve(process.cwd());
const SEED_CATEGORIES = new Set(["ops", "guides"]);

function loadEnv() {
  dotenv.config({ path: path.join(repoRoot, ".env.local") });
  dotenv.config({ path: path.join(repoRoot, ".env") });
  dotenv.config({ path: path.join(repoRoot, ".env.vercel.local") });
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function loadTemplatesFromTs(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
    fileName: filePath,
    reportDiagnostics: false,
  }).outputText;

  const sandbox = {
    exports: {},
    module: { exports: {} },
    require: (id) => {
      throw new Error(`Unexpected require('${id}') while loading templates`);
    },
  };

  vm.runInNewContext(transpiled, sandbox, { filename: filePath });

  const mod = sandbox.module.exports;
  const ADMIN_DOC_TEMPLATES = mod.ADMIN_DOC_TEMPLATES ?? sandbox.exports.ADMIN_DOC_TEMPLATES;
  const ADMIN_DOC_TEMPLATES_BG = mod.ADMIN_DOC_TEMPLATES_BG ?? sandbox.exports.ADMIN_DOC_TEMPLATES_BG;

  if (!Array.isArray(ADMIN_DOC_TEMPLATES)) {
    throw new Error("Failed to load ADMIN_DOC_TEMPLATES from templates.ts");
  }
  if (!Array.isArray(ADMIN_DOC_TEMPLATES_BG)) {
    throw new Error("Failed to load ADMIN_DOC_TEMPLATES_BG from templates.ts");
  }

  return { ADMIN_DOC_TEMPLATES, ADMIN_DOC_TEMPLATES_BG };
}

async function getLocaleCount(supabase, locale) {
  const { count, error } = await supabase
    .from("admin_docs")
    .select("*", { count: "exact", head: true })
    .eq("locale", locale);

  if (error) throw error;
  return typeof count === "number" ? count : 0;
}

async function seedLocale(supabase, locale, templates) {
  const before = await getLocaleCount(supabase, locale);

  const rows = templates.filter((t) => SEED_CATEGORIES.has(t.category)).map((t) => ({
    title: t.title,
    slug: t.slug,
    category: t.category,
    status: t.status,
    content: t.content,
    locale,
  }));

  const { error } = await supabase
    .from("admin_docs")
    .upsert(rows, { onConflict: "locale,slug", ignoreDuplicates: true });

  if (error) throw error;

  const after = await getLocaleCount(supabase, locale);
  const inserted = Math.max(0, after - before);

  process.stdout.write(`[admin_docs] locale=${locale} inserted=${inserted} total=${after}\n`);
}

async function main() {
  loadEnv();

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const templatesPath = path.join(repoRoot, "app", "api", "admin", "docs", "seed", "templates.ts");
  const { ADMIN_DOC_TEMPLATES, ADMIN_DOC_TEMPLATES_BG } = loadTemplatesFromTs(templatesPath);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  await seedLocale(supabase, "en", ADMIN_DOC_TEMPLATES);
  await seedLocale(supabase, "bg", ADMIN_DOC_TEMPLATES_BG);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
