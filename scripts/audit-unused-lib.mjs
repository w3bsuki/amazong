import fs from 'node:fs';
import path from 'node:path';

function walkDir(dir) {
  let results = [];
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) results.push(...walkDir(full));
    else if (file.endsWith('.ts') || file.endsWith('.tsx')) results.push(full);
  }
  return results;
}

const libFiles = walkDir('lib');
const allAppFiles = [...walkDir('app'), ...walkDir('components'), ...walkDir('hooks')];
const testFiles = walkDir('__tests__');

const possiblyUnused = [];
for (const libFile of libFiles) {
  const rel = libFile.replace(/\\/g, '/');
  const importPath = '@/lib/' + rel.replace('lib/', '').replace(/\.tsx?$/, '');
  const shortName = path.basename(libFile).replace(/\.tsx?$/, '');

  let found = false;
  for (const appFile of [...allAppFiles, ...testFiles]) {
    const content = fs.readFileSync(appFile, 'utf-8');
    if (content.includes(importPath) || content.includes('/' + shortName + '"') || content.includes("/" + shortName + "'")) {
      found = true;
      break;
    }
  }

  if (!found) {
    for (const otherLib of libFiles) {
      if (otherLib === libFile) continue;
      const content = fs.readFileSync(otherLib, 'utf-8');
      if (content.includes(importPath) || content.includes('./' + shortName)) {
        found = true;
        break;
      }
    }
  }

  if (!found) possiblyUnused.push(rel);
}

console.log(`Possibly unused lib files (${possiblyUnused.length}):`);
possiblyUnused.forEach(f => console.log('  ' + f));
