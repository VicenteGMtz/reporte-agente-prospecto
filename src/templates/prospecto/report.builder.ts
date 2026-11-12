import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CheckupPayloadGNP } from '../../types/checkup.types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  // Apunta a src/assets saliendo de src/templates/prospecto (../../)
  const fullPath = path.resolve(__dirname, '..', '..', 'assets', relativeAssetPath);
  if (fs.existsSync(fullPath)) {
    const fileBuffer = fs.readFileSync(fullPath);
    return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
  }
  return '';
}

// Ícono SVG vectorial idéntico al círculo verde con check de Figma
const CHECK_ICON_SVG = `
<svg class="check-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10.5" stroke="#53b36e" stroke-width="1.8"/>
  <path d="M7.5 12.2L10.5 15.2L16.5 9.2" stroke="#53b36e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export function renderCheckupHtml(data: CheckupPayloadGNP): string {
  const info = data.cliente?.infoPersonal;

  // Imágenes
  const logoGnp = data.headers?.urlImgLogo || getAssetBase64('images/logo-gnp.png', 'image/png');
  const fondoBanner = data.headers?.urlImgFondo || getAssetBase64('images/fondo-banner.jpg', 'image/jpeg');
  const tacometroImg = data.estatusSaud?.estatus?.urlImgEstatus || getAssetBase64('images/tacometro.png', 'image/png');
  const ilustracionFoco = getAssetBase64('images/ilustracion-foco.png', 'image/png');

  // Fecha
  let fecha = '09/10/2026';
  if (data.intermediario?.fechaAnalisis) {
    fecha = data.intermediario.fechaAnalisis instanceof Date
      ? data.intermediario.fechaAnalisis.toLocaleDateString('es-MX')
      : String(data.intermediario.fechaAnalisis);
  }

  // Demográficos
  const demograficos = [
    info?.sexo || 'Masculino',
    info?.edad ? `${info.edad} años` : '',
    info?.direccion || ''
  ].filter(Boolean).join(' | ');

  // Frase de estatus
  const fraseEstatus = data.estatusSaud?.fraseEstatusSalud || `Estado de Salud Financiero de ${info?.nombre || 'Cliente'}:`;

  // Construcción dinámica de recomendaciones
  const recomendacionesArray = data.recomendaciones?.recomenadciones || [];
  const listaRecomendacionesHtml = recomendacionesArray
    .map((texto) => `
      <div class="recomendacion-item">
        ${CHECK_ICON_SVG}
        <p class="recomendacion-texto">${texto}</p>
      </div>
    `)
    .join('');

  return htmlBase
    .replace('/* {{ESTILOS_CSS}} */', cssBase)
    .replaceAll('{{LOGO_GNP_SRC}}', logoGnp)
    .replaceAll('{{FECHA_ANALISIS}}', fecha)
    .replace('{{FONDO_BANNER_SRC}}', fondoBanner)
    .replace('{{TITULO_HEADER}}', data.headers?.titulo || 'CHECK UP FINANCIERO')
    .replace('{{SUBTITULO_HEADER}}', data.headers?.subtitulo || 'Resultados | Principales factores')
    .replace('{{FRASE_ESTATUS}}', fraseEstatus)
    .replace('{{TACOMETRO_IMG_SRC}}', tacometroImg)
    .replace('{{COLOR_BADGE}}', data.estatusSaud?.color || '#f1b434')
    .replace('{{NOMBRE_ESTATUS}}', data.estatusSaud?.estatus?.nombre || 'ESTABLE')
    .replace('{{CLIENTE_NOMBRE}}', info?.nombre || 'David Ramos')
    .replace('{{CLIENTE_DEMOGRAFICOS}}', demograficos)
    .replace('{{ILUSTRACION_FOCO_SRC}}', ilustracionFoco)
    .replace('{{TITULO_RECOMENDACIONES}}', data.recomendaciones?.tituloRecomenacion || 'Recomendaciones para que mejore su salud financiera y la de su familia.')
    .replace('{{LISTA_RECOMENDACIONES}}', listaRecomendacionesHtml);
}