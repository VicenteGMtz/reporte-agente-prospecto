import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

let cachedRobotoCss: string | null = null;

function toWoff2DataUri(pkgFilePath: string): string {
  const resolvedPath = require.resolve(pkgFilePath);
  const buffer = fs.readFileSync(resolvedPath);
  return `data:font/woff2;base64,${buffer.toString('base64')}`;
}

export function getRobotoFontFacesCss(): string {
  if (cachedRobotoCss !== null) return cachedRobotoCss;

  const w400 = toWoff2DataUri('@fontsource/roboto/files/roboto-latin-400-normal.woff2');
  const w500 = toWoff2DataUri('@fontsource/roboto/files/roboto-latin-500-normal.woff2');
  const w700 = toWoff2DataUri('@fontsource/roboto/files/roboto-latin-700-normal.woff2');

  cachedRobotoCss = `
    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('${w400}') format('woff2');
    }
    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url('${w500}') format('woff2');
    }
    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: url('${w700}') format('woff2');
    }
  `;

  return cachedRobotoCss;
}