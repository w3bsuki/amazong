import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";

import { createClient } from "@supabase/supabase-js";

const repoRoot = path.resolve(process.cwd());

function loadEnv() {
  dotenv.config({ path: path.join(repoRoot, ".env.local") });
  dotenv.config({ path: path.join(repoRoot, ".env") });
  dotenv.config({ path: path.join(repoRoot, ".env.vercel.local") });
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

async function exportLocale(supabase, locale) {
  const { data, error } = await supabase
    .from("admin_docs")
    .select("title,slug,category,status,author_id,locale,created_at,updated_at,content")
    .eq("locale", locale)
    .order("category")
    .order("slug");

  if (error) throw error;
  return data ?? [];
}

async function main() {
  loadEnv();

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const exportedAt = new Date().toISOString();
  const payload = {
    exported_at: exportedAt,
    locales: {
      en: await exportLocale(supabase, "en"),
      bg: await exportLocale(supabase, "bg"),
    },
  };

  const outDir = path.join(repoRoot, ".codex", "audit", "admin-docs-export");
  await fs.mkdir(outDir, { recursive: true });

  const outPath = path.join(outDir, `${todayIsoDate()}.json`);
  await fs.writeFile(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");

  process.stdout.write(`[admin_docs] exported ${outPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});

