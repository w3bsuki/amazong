/**
 * Deterministic checks for spec-tailwind audit output
 * Run: node .codex/evals/skills/spec-tailwind/checks.mjs <output-file>
 */

import { readFileSync } from 'node:fs';

const REQUIRED_SECTIONS = ['Scope', 'Findings', 'Acceptance Checks', 'Risks'];

// Valid semantic tokens (subset - full list in globals.css)
const VALID_TOKEN_PREFIXES = [
  'bg-background', 'bg-card', 'bg-surface', 'bg-muted', 'bg-hover', 'bg-active', 'bg-selected',
  'text-foreground', 'text-muted-foreground', 'text-primary', 'text-price', 'text-success',
  'text-warning', 'text-error', 'text-info', 'text-deal', 'text-verified', 'text-rating',
  'border-border', 'border-hover', 'border-selected', 'ring-ring',
];

export function validateTw4Audit(outputText) {
  const results = {
    heading_correct: false,
    sections_present: false,
    ids_sequential: false,
    evidence_present: false,
    read_only: true,
    token_fixes: true,
    errors: [],
  };

  // Check heading
  if (outputText.startsWith('## TW4')) {
    results.heading_correct = true;
  } else {
    results.errors.push('Output must start with "## TW4"');
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
  const idMatches = outputText.match(/TW4-\d{3}/g) || [];
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
    const hasEvidence = /\w+\.(tsx?|jsx?|css):\d+/.test(findingsSection);
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

  // Check token fixes (look for palette colors in Fix column)
  const palettePattern = /\b(bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g;
  const paletteInFixes = findingsSection.match(palettePattern);
  if (paletteInFixes) {
    results.token_fixes = false;
    results.errors.push(`Fixes suggest palette colors: ${paletteInFixes.join(', ')}`);
  }

  return results;
}

// CLI runner
if (process.argv[2]) {
  const content = readFileSync(process.argv[2], 'utf8');
  const results = validateTw4Audit(content);
  console.log(JSON.stringify(results, null, 2));
  process.exit(results.errors.length > 0 ? 1 : 0);
}
