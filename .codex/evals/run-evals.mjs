#!/usr/bin/env node
/**
 * Agent Skill Eval Runner
 * Validates skill outputs against deterministic checks.
 *
 * Usage:
 *   node .codex/evals/run-evals.mjs                    # Run all skill evals
 *   node .codex/evals/run-evals.mjs --skill spec-shadcn  # Run specific skill
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = join(__dirname, 'skills');

// ANSI colors
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

async function loadSkillChecker(skillDir) {
  const checksPath = join(skillDir, 'checks.mjs');
  if (!existsSync(checksPath)) {
    return null;
  }
  const checkerModule = await import(`file://${checksPath}`);
  return checkerModule.validateShadcnAudit || checkerModule.validateTw4Audit || checkerModule.validateNextjsAudit || checkerModule.validateSupabaseAudit;
}

function validatePromptsFile(skillDir, skillName) {
  const promptsPath = join(skillDir, 'prompts.jsonl');
  if (!existsSync(promptsPath)) {
    return { valid: false, error: 'prompts.jsonl not found' };
  }

  const lines = readFileSync(promptsPath, 'utf8').trim().split('\n');
  const errors = [];

  for (let i = 0; i < lines.length; i++) {
    try {
      const prompt = JSON.parse(lines[i]);
      if (!prompt.id) errors.push(`Line ${i + 1}: missing 'id' field`);
      if (typeof prompt.should_trigger !== 'boolean') errors.push(`Line ${i + 1}: missing 'should_trigger' boolean`);
      if (!prompt.prompt) errors.push(`Line ${i + 1}: missing 'prompt' field`);
    } catch (e) {
      errors.push(`Line ${i + 1}: invalid JSON`);
    }
  }

  return { valid: errors.length === 0, errors, count: lines.length };
}

async function runFixtureChecks(skillDir, skillName, checker) {
  const fixturesDir = join(skillDir, 'fixtures');
  if (!existsSync(fixturesDir)) {
    return { valid: true, skipped: true };
  }

  const fixtures = readdirSync(fixturesDir).filter((f) => f.endsWith('.md'));
  const results = [];

  for (const fixture of fixtures) {
    const content = readFileSync(join(fixturesDir, fixture), 'utf8');
    const result = checker(content);
    results.push({
      fixture,
      passed: result.errors.length === 0,
      errors: result.errors,
    });
  }

  return { valid: true, results };
}

async function evaluateSkill(skillName) {
  const skillDir = join(SKILLS_DIR, skillName);
  console.log(`\n${YELLOW}━━━ ${skillName} ━━━${RESET}`);

  // 1. Validate prompts.jsonl
  const promptsResult = validatePromptsFile(skillDir, skillName);
  if (!promptsResult.valid) {
    console.log(`${RED}✗ prompts.jsonl: ${promptsResult.error}${RESET}`);
    return false;
  }
  console.log(`${GREEN}✓ prompts.jsonl: ${promptsResult.count} scenarios${RESET}`);
  if (promptsResult.errors?.length > 0) {
    promptsResult.errors.forEach((e) => console.log(`  ${RED}${e}${RESET}`));
    return false;
  }

  // 2. Load checker
  const checker = await loadSkillChecker(skillDir);
  if (!checker) {
    console.log(`${YELLOW}⚠ checks.mjs: not found (skipping fixture validation)${RESET}`);
    return true;
  }
  console.log(`${GREEN}✓ checks.mjs: loaded${RESET}`);

  // 3. Run fixture checks
  const fixtureResults = await runFixtureChecks(skillDir, skillName, checker);
  if (fixtureResults.skipped) {
    console.log(`${YELLOW}⚠ fixtures/: not found (skipping)${RESET}`);
    return true;
  }

  let allPassed = true;
  for (const result of fixtureResults.results) {
    if (result.passed) {
      console.log(`${GREEN}✓ fixtures/${result.fixture}${RESET}`);
    } else {
      console.log(`${RED}✗ fixtures/${result.fixture}${RESET}`);
      result.errors.forEach((e) => console.log(`  - ${e}`));
      allPassed = false;
    }
  }

  return allPassed;
}

async function main() {
  const args = process.argv.slice(2);
  const skillArg = args.indexOf('--skill');
  const targetSkill = skillArg !== -1 ? args[skillArg + 1] : null;

  console.log('🔍 Agent Skill Eval Runner\n');

  if (!existsSync(SKILLS_DIR)) {
    console.log(`${RED}Error: ${SKILLS_DIR} not found${RESET}`);
    process.exit(1);
  }

  const skills = targetSkill
    ? [targetSkill]
    : readdirSync(SKILLS_DIR).filter((f) => {
        const fullPath = join(SKILLS_DIR, f);
        return existsSync(join(fullPath, 'prompts.jsonl'));
      });

  if (skills.length === 0) {
    console.log(`${YELLOW}No skills with prompts.jsonl found${RESET}`);
    process.exit(0);
  }

  let allPassed = true;
  for (const skill of skills) {
    const passed = await evaluateSkill(skill);
    if (!passed) allPassed = false;
  }

  console.log('\n' + '━'.repeat(40));
  if (allPassed) {
    console.log(`${GREEN}✓ All skill evals passed${RESET}`);
    process.exit(0);
  } else {
    console.log(`${RED}✗ Some skill evals failed${RESET}`);
    process.exit(1);
  }
}

main();
