import { CheckupPayloadGNP } from '../../../../types/checkup.types.js';
import { TemplateLoader } from '../../../../utils/template-loader.util.js';

const BASE_PATH = 'templates/client/sections/cover';
const htmlTemplate = TemplateLoader.readFile(`${BASE_PATH}/cover.html`);
const cssStyles = TemplateLoader.readFile(`${BASE_PATH}/cover.css`);

export function buildCoverSection(data: CheckupPayloadGNP, logoGnp: string, date: string): { html: string; css: string } {
  const info = data.cliente?.infoPersonal;

  const bannerBg = data.headers?.urlImgFondo || TemplateLoader.getImageBase64('fondo-banner.jpg', 'image/jpeg');
  const gaugeImg = data.estatusSaud?.estatus?.urlImgEstatus || TemplateLoader.getImageBase64('tacometro.png', 'image/png');
  const bulbIllustration = TemplateLoader.getImageBase64('ilustracion-foco.png', 'image/png');

  const demographics = [
    info?.sexo || 'Masculino',
    info?.edad ? `${info.edad} años` : '',
    info?.direccion || '',
  ]
    .filter(Boolean)
    .join(' | ');

  const statusPhrase =
    data.estatusSaud?.fraseEstatusSalud || `Estado de Salud Financiero de ${info?.nombre || 'Cliente'}:`;

  const html = htmlTemplate
    .replace('{{LOGO_GNP_SRC}}', logoGnp)
    .replace('{{FECHA_ANALISIS}}', date)
    .replace('{{FONDO_BANNER_SRC}}', bannerBg)
    .replace('{{TITULO_HEADER}}', data.headers?.titulo || 'CHECK UP FINANCIERO')
    .replace('{{SUBTITULO_HEADER}}', data.headers?.subtitulo || 'Resultados | Principales factores')
    .replace('{{FRASE_ESTATUS}}', statusPhrase)
    .replace('{{TACOMETRO_IMG_SRC}}', gaugeImg)
    .replace('{{COLOR_BADGE}}', data.estatusSaud?.color || '#f1b434')
    .replace('{{NOMBRE_ESTATUS}}', data.estatusSaud?.estatus?.nombre || 'ESTABLE')
    .replace('{{CLIENTE_NOMBRE}}', info?.nombre || 'David Ramos')
    .replace('{{CLIENTE_DEMOGRAFICOS}}', demographics)
    .replace('{{ILUSTRACION_FOCO_SRC}}', bulbIllustration);

  return { html, css: cssStyles };
}