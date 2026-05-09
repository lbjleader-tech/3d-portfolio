import { createReadStream, existsSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { createServer } from 'node:http';

const host = process.env.HOST ?? '0.0.0.0';
const port = Number(process.env.PORT ?? 5173);
const root = resolve(process.cwd());

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
]);

const toSafePath = (url = '/') => {
  const requestPath = decodeURIComponent(new URL(url, `http://${host}:${port}`).pathname);
  const normalizedPath = normalize(requestPath).replace(/^([/\\])+/, '');
  const filePath = resolve(join(root, normalizedPath || 'index.html'));

  return filePath.startsWith(root) ? filePath : join(root, 'index.html');
};

const server = createServer((request, response) => {
  let filePath = toSafePath(request.url);

  if (!existsSync(filePath) || filePath.endsWith('/')) {
    filePath = join(root, 'index.html');
  }

  response.setHeader('Content-Type', contentTypes.get(extname(filePath)) ?? 'application/octet-stream');
  createReadStream(filePath)
    .on('error', () => {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    })
    .pipe(response);
});

server.listen(port, host, () => {
  console.log(`3D portfolio running at http://localhost:${port}`);
});
