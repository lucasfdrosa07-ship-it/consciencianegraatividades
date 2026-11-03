import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const manifest = JSON.parse((await readFile(path.join(root, 'scripts/assets-manifest.json'), 'utf8')).replace(/^\uFEFF/, ''));
const output = path.join(root, 'public/images');
await mkdir(path.join(output, 'originals'), { recursive: true });
const results = [];
async function prepare(asset) {
  const original = path.join(output, 'originals', `${asset.name}.png`);
  let bytes;
  try { bytes = await readFile(original); }
  catch {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(asset.url, { signal: AbortSignal.timeout(45000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        bytes = Buffer.from(await response.arrayBuffer());
        await sharp(bytes).metadata();
        await writeFile(original, bytes);
        break;
      } catch (error) {
        if (attempt === 2) throw new Error(`${asset.name}: ${error.message}`);
      }
    }
  }
  const metadata = await sharp(bytes).metadata();
  const webp = await sharp(bytes).resize({ width: 1440, withoutEnlargement: true }).webp({ quality: asset.name.startsWith("depoimento-") ? 80 : 91, alphaQuality: 100, effort: 6 }).toBuffer();
  await writeFile(path.join(output, `${asset.name}.webp`), webp);
  const info = await sharp(webp).metadata();
  const result = { ...asset, src: `/images/${asset.name}.webp`, width: info.width, height: info.height, originalBytes: bytes.length, optimizedBytes: webp.length, alpha: metadata.hasAlpha };
  results.push(result);
  console.log(`${asset.name}: ${metadata.width}x${metadata.height}, ${Math.round(bytes.length/1024)} KB → ${Math.round(webp.length/1024)} KB`);
}
for (let i=0; i<manifest.length; i+=4) await Promise.all(manifest.slice(i, i+4).map(prepare));
const ordered = manifest.map(asset => results.find(result => result.name === asset.name));
await writeFile(path.join(root, 'src/config/assets.json'), JSON.stringify(Object.fromEntries(ordered.map(asset => [asset.name, asset])), null, 2));
await writeFile(path.join(root, 'docs/image-report.json'), JSON.stringify(ordered, null, 2));

const fontRequests = [
  ['fredoka', 'Fredoka:wght@400..700'],
  ['nunito-sans', 'Nunito+Sans:wght@400..800'],
];
for (const [name, family] of fontRequests) {
  const css = await fetch(`https://fonts.googleapis.com/css2?family=${family}&display=swap`, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' } }).then(r => r.text());
  const urls = [...css.matchAll(/url\((https:[^)]+)\)/g)].map(m => m[1]);
  const unique = [...new Set(urls)];
  if (!unique.length) throw new Error(`Fonte não encontrada: ${name}`);
  // Last subset is Latin, including the accented characters used in Portuguese.
  const font = await fetch(unique.at(-1)).then(r => r.arrayBuffer());
  await writeFile(path.join(root, `src/fonts/${name}.woff2`), Buffer.from(font));
  console.log(`Fonte local: ${name} (${Math.round(font.byteLength/1024)} KB)`);
}
const inputBytes = ordered.reduce((sum, a) => sum + a.originalBytes, 0);
const outputBytes = ordered.reduce((sum, a) => sum + a.optimizedBytes, 0);
console.log(`TOTAL: ${ordered.length} imagens; ${(inputBytes/1024/1024).toFixed(2)} MB → ${(outputBytes/1024/1024).toFixed(2)} MB`);
