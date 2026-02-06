import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const schemaPath = path.join(repoRoot, "docs", "status", "LAUNCH-READINESS.schema.json");
const dataPath = path.join(repoRoot, "docs", "status", "LAUNCH-READINESS.yaml");

function readJsonFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

function typeOfValue(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function validateNode(value, schema, pathLabel, errors) {
  if (!schema || typeof schema !== "object") return;

  if (schema.type) {
    const actualType = typeOfValue(value);
    if (schema.type !== actualType) {
      errors.push(`${pathLabel}: expected type '${schema.type}', got '${actualType}'`);
      return;
    }
  }

  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${pathLabel}: value '${String(value)}' not in enum [${schema.enum.join(", ")}]`);
  }

  if (schema.type === "number") {
    if (typeof schema.minimum === "number" && value < schema.minimum) {
      errors.push(`${pathLabel}: value ${value} < minimum ${schema.minimum}`);
    }
    if (typeof schema.maximum === "number" && value > schema.maximum) {
      errors.push(`${pathLabel}: value ${value} > maximum ${schema.maximum}`);
    }
  }

  if (schema.type === "array") {
    if (typeof schema.minItems === "number" && value.length < schema.minItems) {
      errors.push(`${pathLabel}: array length ${value.length} < minItems ${schema.minItems}`);
    }
    if (schema.items) {
      value.forEach((item, index) => {
        validateNode(item, schema.items, `${pathLabel}[${index}]`, errors);
      });
    }
    return;
  }

  if (schema.type === "object") {
    const required = Array.isArray(schema.required) ? schema.required : [];
    for (const requiredKey of required) {
      if (!(requiredKey in value)) {
        errors.push(`${pathLabel}: missing required key '${requiredKey}'`);
      }
    }

    const properties = schema.properties ?? {};
    for (const [key, propSchema] of Object.entries(properties)) {
      if (!(key in value)) continue;
      validateNode(value[key], propSchema, `${pathLabel}.${key}`, errors);
    }
  }
}

function main() {
  if (!fs.existsSync(schemaPath)) {
    process.stderr.write("Missing schema file docs/status/LAUNCH-READINESS.schema.json\n");
    process.exitCode = 1;
    return;
  }
  if (!fs.existsSync(dataPath)) {
    process.stderr.write("Missing data file docs/status/LAUNCH-READINESS.yaml\n");
    process.exitCode = 1;
    return;
  }

  let schema;
  let data;
  try {
    schema = readJsonFile(schemaPath);
  } catch (error) {
    process.stderr.write(`Invalid schema JSON: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
    return;
  }

  try {
    data = readJsonFile(dataPath);
  } catch (error) {
    process.stderr.write(
      `Invalid launch readiness format (must be JSON-compatible YAML): ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
    return;
  }

  const errors = [];
  validateNode(data, schema, "$", errors);

  if (errors.length > 0) {
    process.stderr.write("Launch readiness validation failed:\n");
    for (const error of errors) {
      process.stderr.write(`- ${error}\n`);
    }
    process.exitCode = 1;
    return;
  }

  process.stdout.write("Launch readiness validation passed.\n");
}

main();
