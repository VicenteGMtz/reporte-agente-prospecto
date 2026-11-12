import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CheckupPayloadGNP } from '../../types/checkup.types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas a src/assets saliendo de templates (..)
const htmlPath = path.resolve(__dirname, 'report.html');
const cssPath = path.resolve(__dirname, 'report.styles.css');

if (!fs.existsSync(htmlPath)) {
  throw new Error(`No se encontró el archivo HTML en: ${htmlPath}`);
}
if (!fs.existsSync(cssPath)) {
  throw new Error(`No se encontró el archivo CSS en: ${cssPath}`);
}

const htmlBase = fs.readFileSync(htmlPath, 'utf-8');
const cssBase = fs.readFileSync(cssPath, 'utf-8');

function getAssetBase64(relativeAssetPath: string, mimeType: string = 'image/png'): string {
  const fullPath = path.resolve(__dirname, '..', 'assets', relativeAssetPath);
  if (fs.existsSync(fullPath)) {
    const fileBuffer = fs.readFileSync(fullPath);
    return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
  }
  return '';
}

export function renderCheckupHtml(data: CheckupPayloadGNP): string {
  const info = data.cliente?.infoPersonal;

  // Prioridad: URL remota del JSON -> Fallback a asset local en Base64
  const logoGnp = data.headers?.urlImgLogo || getAssetBase64('images/logo-gnp.png', 'image/png');
  const fondoBanner = data.headers?.urlImgFondo || getAssetBase64('images/fondo-banner.jpg', 'image/jpeg');
  const tacometroImg = data.estatusSaud?.estatus?.urlImgEstatus || getAssetBase64('images/tacometro.png', 'image/png');
  const ilustracionFoco = data.estatusSaud?.estatus?.urlImgEstatus ||  getAssetBase64('images/ilustracion-foco.png', 'image/png');

  let fecha = '09/10/2026';
  if (data.intermediario?.fechaAnalisis) {
    fecha = data.intermediario.fechaAnalisis instanceof Date
      ? data.intermediario.fechaAnalisis.toLocaleDateString('es-MX')
      : String(data.intermediario.fechaAnalisis);
  }

  const demograficos = [
    info?.sexo || 'Masculino',
    info?.edad ? `${info.edad} años` : '',
    info?.direccion || ''
  ].filter(Boolean).join(' | ');

  const fraseEstatus = data.estatusSaud?.fraseEstatusSalud || `Estado de Salud Financiero de ${info?.nombre || 'Cliente'}:`;

  return htmlBase
    .replace('/* {{ESTILOS_CSS}} */', cssBase)
    .replace('{{LOGO_GNP_SRC}}', logoGnp)
    .replace('{{FECHA_ANALISIS}}', fecha)
    .replace('{{FONDO_BANNER_SRC}}', fondoBanner)
    .replace('{{TITULO_HEADER}}', data.headers?.titulo || 'CHECK UP FINANCIERO')
    .replace('{{SUBTITULO_HEADER}}', data.headers?.subtitulo || 'Resultados | Principales factores')
    .replace('{{FRASE_ESTATUS}}', fraseEstatus)
    .replace('{{TACOMETRO_IMG_SRC}}', tacometroImg)
    .replace('{{COLOR_BADGE}}', data.estatusSaud?.color || '#f1b434')
    .replace('{{NOMBRE_ESTATUS}}', data.estatusSaud?.estatus?.nombre || 'ESTABLE')
    .replace('{{CLIENTE_NOMBRE}}', info?.nombre || 'David Ramos')
    .replace('{{CLIENTE_DEMOGRAFICOS}}', demograficos)
    .replace('{{ILUSTRACION_FOCO_SRC}}', ilustracionFoco);
}