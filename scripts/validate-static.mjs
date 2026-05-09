import { access, readFile } from 'node:fs/promises';

const requiredFiles = ['index.html', 'src/main.js', 'src/styles.css', 'server.mjs'];

await Promise.all(requiredFiles.map((file) => access(file)));

const html = await readFile('index.html', 'utf8');
const missingReferences = ['/src/styles.css', '/src/main.js'].filter((asset) => !html.includes(asset));

if (missingReferences.length > 0) {
  throw new Error(`index.html is missing asset references: ${missingReferences.join(', ')}`);
}

console.log('Static portfolio files validated.');
