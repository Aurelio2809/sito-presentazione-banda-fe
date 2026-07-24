import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const assetsDir = path.resolve('src/assets');
const outputDir = path.join(assetsDir, 'responsive');
const extensions = new Set(['.jpg', '.jpeg', '.png']);
const photoWidths = [640, 960];
const graphicWidths = [256, 512];
const heroImage = 'about/oggi-concerto-estivo.jpg';

async function filesIn(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'responsive' ? [] : filesIn(fullPath);
    return extensions.has(path.extname(entry.name).toLowerCase()) ? [fullPath] : [];
  }));
  return files.flat();
}

const images = await filesIn(assetsDir);
await fs.rm(outputDir, { recursive: true, force: true });

for (const input of images) {
  const relative = path.relative(assetsDir, input);
  const parsed = path.parse(relative);
  const widths = parsed.ext.toLowerCase() === '.png' ? graphicWidths : photoWidths;
  const imageWidths = relative === heroImage ? [...widths, 1920] : widths;

  for (const width of [...new Set(imageWidths)]) {
    const outputBase = path.join(outputDir, parsed.dir, `${parsed.name}-${width}`);
    await fs.mkdir(path.dirname(outputBase), { recursive: true });
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${outputBase}.webp`);
  }
}

console.log(`Generated responsive WebP variants for ${images.length} images.`);
