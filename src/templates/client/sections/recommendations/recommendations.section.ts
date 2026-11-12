import { CheckupPayloadGNP } from '../../../../types/checkup.types.js';
import { TemplateLoader } from '../../../../utils/template-loader.util.js';

const BASE_PATH = 'templates/client/sections/recommendations';
const htmlTemplate = TemplateLoader.readFile(`${BASE_PATH}/recommendations.html`);
const cssStyles = TemplateLoader.readFile(`${BASE_PATH}/recommendations.css`);

const CHECK_ICON_SVG = `
<svg class="check-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10.5" stroke="#53b36e" stroke-width="1.8"/>
  <path d="M7.5 12.2L10.5 15.2L16.5 9.2" stroke="#53b36e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export function buildRecommendationsSection(data: CheckupPayloadGNP): { html: string; css: string } {
  const list = data.recomendaciones?.recomenadciones || [];

  const itemsHtml = list
    .map(
      (text) => `
      <div class="recomendacion-item">
        ${CHECK_ICON_SVG}
        <p class="recomendacion-texto">${text}</p>
      </div>`
    )
    .join('');

  const html = htmlTemplate
    .replace(
      '{{TITULO_RECOMENDACIONES}}',
      data.recomendaciones?.tituloRecomenacion || 'Recomendaciones para que mejore su salud financiera y la de su familia.'
    )
    .replace('{{LISTA_RECOMENDACIONES}}', itemsHtml);

  return { html, css: cssStyles };
}