const toolName = process.env.tool_name || process.env.TOOL_NAME || '';
const toolInputRaw = process.env.tool_input || process.env.TOOL_INPUT || '';

function normalizePath(maybePath) {
  if (typeof maybePath !== 'string') return '';
  return maybePath.trim().replaceAll('\\', '/');
}

function isSensitivePath(path) {
  const p = normalizePath(path);
  if (!p) return false;

  // .env and .env.* anywhere in the repo
  if (/(^|\/)\.env(\.|$)/.test(p)) return true;

  // secrets directory anywhere in the repo
  if (/(^|\/)secrets(\/|$)/.test(p)) return true;

  return false;
}

function isGeneratedOrVendorPath(path) {
  const p = normalizePath(path);
  if (!p) return false;

  // These should never be edited by an agent.
  if (/(^|\/)node_modules(\/|$)/.test(p)) return true;
  if (/(^|\/)\.next(\/|$)/.test(p)) return true;
  if (/(^|\/)(playwright-report|test-results)(\/|$)/.test(p)) return true;

  return false;
}

function block(reason) {
  process.stderr.write(`[Guardrails] ${reason}\n`);
  process.exit(2);
}

let toolInput = null;
if (toolInputRaw) {
  try {
    toolInput = JSON.parse(toolInputRaw);
  } catch {
    toolInput = null;
  }
}

if (!toolName) process.exit(0);

if (toolName === 'Read' || toolName === 'Write' || toolName === 'Edit') {
  const filePath = normalizePath(
    toolInput?.file_path ?? toolInput?.path ?? toolInput?.filepath ?? toolInput?.filePath,
  );

  if (isSensitivePath(filePath)) {
    block(`Blocked ${toolName} for sensitive path: ${filePath || '(unknown path)'}`);
  }

  if ((toolName === 'Write' || toolName === 'Edit') && isGeneratedOrVendorPath(filePath)) {
    block(`Blocked ${toolName} for generated/vendor path: ${filePath || '(unknown path)'}`);
  }

  process.exit(0);
}

if (toolName === 'Bash') {
  const command = typeof toolInput?.command === 'string' ? toolInput.command : '';
  const commandNormalized = command.replaceAll('\\', '/');

  if (/(^|\s)(cat|type|sed|awk|grep|rg)\s+.*\.env(\.|$)/.test(commandNormalized)) {
    block('Blocked Bash command that appears to access .env* files.');
  }
  if (/(^|\s)(cat|type|sed|awk|grep|rg)\s+.*secrets(\/|$)/.test(commandNormalized)) {
    block('Blocked Bash command that appears to access secrets/.');
  }

  process.exit(0);
}

process.exit(0);

