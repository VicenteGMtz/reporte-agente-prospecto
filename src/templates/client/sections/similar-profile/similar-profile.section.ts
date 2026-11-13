import { CheckupPayloadGNP } from '../../../../types/checkup.types.js';
import { TemplateLoader } from '../../../../utils/template-loader.util.js';

const BASE_PATH = 'templates/client/sections/similar-profile';
const htmlTemplate = TemplateLoader.readFile(`${BASE_PATH}/similar-profile.html`);
const cssStyles = TemplateLoader.readFile(`${BASE_PATH}/similar-profile.css`);

function renderPersonSvg(active: boolean): string {
  const fill = active ? '#0066cc' : '#d1d5db';
  return `
    <svg class="person-icon" viewBox="0 0 24 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="6" r="4.5" fill="${fill}"/>
      <path d="M5 16C5 13.8 6.8 12 9 12H15C17.2 12 19 13.8 19 16V27H16.2V43H13V29H11V43H7.8V27H5V16Z" fill="${fill}"/>
    </svg>`;
}

function renderMiniDonutSvg(percentage: number): string {
  const pct = Math.min(Math.max(percentage, 0), 100);
  const r = 22;
  const circumference = 2 * Math.PI * r;
  const strokeDasharray = `${(pct / 100) * circumference} ${circumference}`;

  return `
    <div class="comparativa-donut-box">
      <svg width="58" height="58" viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg">
        <circle cx="29" cy="29" r="${r}" fill="#ffffff" />
        <circle cx="29" cy="29" r="${r}" fill="none" stroke="#9ca3af" stroke-width="6" />
        <circle
          cx="29"
          cy="29"
          r="${r}"
          fill="none"
          stroke="#1e293b"
          stroke-width="6"
          stroke-dasharray="${strokeDasharray}"
          stroke-linecap="round"
          transform="rotate(-90 29 29)"
        />
        <text x="29" y="33" text-anchor="middle" fill="#0b326f" font-size="11.5" font-weight="700">${Math.round(pct)}%</text>
      </svg>
    </div>`;
}

export function buildSimilarProfileSection(data: CheckupPayloadGNP): { html: string; css: string } {
  const comparativa = data.comparativaPerfil;
  if (!comparativa) {
    return { html: '', css: '' };
  }

  // 1. Tarjeta superior con 10 siluetas
  const indPerfil = comparativa.comparativaIndPerfil;
  let mainCardHtml = '';

  if (indPerfil) {
    const total = indPerfil.totalComparativa || 10;
    const activeCount = Math.min(Math.max(indPerfil.valorComparativa || 0, 0), total);
    const iconsHtml = Array.from({ length: total }, (_, idx) => renderPersonSvg(idx < activeCount)).join('');

    mainCardHtml = `
      <div class="pea-card">
        <div class="pea-icons-row">${iconsHtml}</div>
        <div class="pea-card-title">${indPerfil.tituloComparativa || ''}</div>
        <p class="pea-card-desc">${indPerfil.descripcionComparativa || ''}</p>
      </div>`;
  }

  // 2. Filas dinámicas inferiores
  const items = comparativa.comparativasIndicadores || [];
  const itemsHtml = items
    .map((item) => {
      const hasChart = typeof item.porcentajeGrafica === 'number' && item.porcentajeGrafica > 0;
      const donutHtml = hasChart ? renderMiniDonutSvg(item.porcentajeGrafica) : '';
      const trailingValue = !hasChart && item.valor ? ` ${item.valor}` : '';

      return `
        <div class="comparativa-row">
          ${donutHtml}
          <div class="comparativa-desc">${item.descripcion || ''}${trailingValue}</div>
        </div>`;
    })
    .join('');

  const html = htmlTemplate
    .replace('{{PERFIL_SIMILAR_TEXT}}', comparativa.perfilSimilar || '')
    .replace('{{MAIN_COMPARISON_CARD}}', mainCardHtml)
    .replace('{{COMPARATIVE_ITEMS_HTML}}', itemsHtml);

  return { html, css: cssStyles };
}