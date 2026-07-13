import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const outputDirectory = join(process.cwd(), 'dist', 'fe', 'browser');
const indexPath = join(outputDirectory, 'index.html');
const index = await readFile(indexPath, 'utf8');

const stylesheetLinks = [...index.matchAll(/<link\b[^>]*>/gi)]
  .map(([link]) => link)
  .filter((link) => /\brel=["']stylesheet["']/i.test(link));

if (stylesheetLinks.length === 0) {
  throw new Error('La build non contiene un foglio di stile principale.');
}

if (stylesheetLinks.some((link) => /\bmedia=["']print["']/i.test(link))) {
  throw new Error(
    'Il foglio tema è caricato come media="print": una CSP restrittiva impedirebbe l’attivazione del tema chiaro.',
  );
}

const files = await readdir(outputDirectory);
const stylesheet = files.find((file) => /^styles-.*\.css$/.test(file));

if (!stylesheet) {
  throw new Error('Il CSS di produzione non è stato generato.');
}

const css = await readFile(join(outputDirectory, stylesheet), 'utf8');

if (!css.includes(':root[data-theme=light]')) {
  throw new Error('Il CSS di produzione non contiene i token del tema chiaro.');
}

console.log(`Tema di produzione verificato: ${stylesheet} è caricato direttamente e include il tema chiaro.`);
