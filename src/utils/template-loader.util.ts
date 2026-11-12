import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.resolve(__dirname, '..');

export class TemplateLoader {
  public static readFile(relativePathFromSrc: string): string {
    const fullPath = path.join(SRC_DIR, relativePathFromSrc);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }
    return fs.readFileSync(fullPath, 'utf-8');
  }

  public static getImageBase64(imageName: string, mimeType = 'image/png'): string {
    const fullPath = path.join(SRC_DIR, 'assets', 'images', imageName);
    if (!fs.existsSync(fullPath)) return '';
    const buffer = fs.readFileSync(fullPath);
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  }
}