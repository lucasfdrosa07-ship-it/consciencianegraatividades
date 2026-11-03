import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('src/fonts/licenses', { recursive: true });
for (const family of ['fredoka', 'nunitosans']) {
  const response = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`);
  if (!response.ok) throw new Error(`${family}: HTTP ${response.status}`);
  await writeFile(`src/fonts/licenses/${family}-OFL.txt`, await response.text());
  console.log(`Licença OFL salva: ${family}`);
}
