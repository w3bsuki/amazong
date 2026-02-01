/**
 * Deterministic checks for spec-nextjs audit output
 * Run: node .codex/evals/skills/spec-nextjs/checks.mjs <output-file>
 */

import { readFileSync } from 'node:fs';

const REQUIRED_SECTIONS = ['Scope', 'Findings', 'Acceptance Checks', 'Risks'];

export function validateNextjsAudit(outputText) {
  const results = {
    heading_correct: false,
    sections_present: false,
    ids_sequential: false,
    evidence_present: false,
    read_only: true,
    no_secrets: true,
    errors: [],
  };

  // Check heading
  if (outputText.startsWith('## NEXTJS')) {
    results.heading_correct = true;
  } else {
    results.errors.push('Output must start with "## NEXTJS"');
  }

  // Check required sections
  const missingSections = REQUIRED_SECTIONS.filter(
    (section) => !outputText.includes(`### ${section}`)
  );
  if (missingSections.length === 0) {
    results.sections_present = true;
  } else {
    results.errors.push(`Missing sections: ${missingSections.join(', ')}`);
  }

  // Check ID sequencing
  const idMatches = outputText.match(/NEXTJS-\d{3}/g) || [];
  if (idMatches.length === 0) {
    if (outputText.toLowerCase().includes('no findings')) {
      results.ids_sequential = true;
    }
  } else {
    const numbers = idMatches.map((id) => parseInt(id.split('-')[1], 10));
    const isSequential = numbers.every((num, i) => num === i + 1);
    results.ids_sequential = isSequential;
    if (!isSequential) {
      results.errors.push(`IDs not sequential: ${idMatches.join(', ')}`);
    }
  }

  // Check evidence
  const findingsSection = outputText.split('### Findings')[1]?.split('###')[0] || '';
  if (findingsSection.includes('No findings')) {
    results.evidence_present = true;
  } else {
    const hasEvidence = /\w+\.(tsx?|jsx?|ts|js):\d+/.test(findingsSection);
    results.evidence_present = hasEvidence;
    if (!hasEvidence && idMatches.length > 0) {
      results.errors.push('Findings missing file:line evidence');
    }
  }

  // Check read-only
  const forbiddenPatterns = ['replace_string_in_file', 'create_file', 'edit TASKS.md'];
  for (const pattern of forbiddenPatterns) {
    if (outputText.toLowerCase().includes(pattern)) {
      results.read_only = false;
      results.errors.push(`Found forbidden pattern: ${pattern}`);
    }
  }

  // Check no secrets (cookies, tokens, headers values)
  const secretPatterns = [/Bearer [A-Za-z0-9\-_]+/, /cookie[=:]\s*[^\s]+/i, /token[=:]\s*[^\s]+/i];
  for (const pattern of secretPatterns) {
    if (pattern.test(outputText)) {
      results.no_secrets = false;
      results.errors.push('Output contains potential secrets/tokens');
    }
  }

  return results;
}

// CLI runner
if (process.argv[2]) {
  const content = readFileSync(process.argv[2], 'utf8');
  const results = validateNextjsAudit(content);
  console.log(JSON.stringify(results, null, 2));
  process.exit(results.errors.length > 0 ? 1 : 0);
}
