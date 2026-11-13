import { CheckupPayloadGNP } from '../../../../types/checkup.types.js';
import { TemplateLoader } from '../../../../utils/template-loader.util.js';

const BASE_PATH = 'templates/client/sections/sociodemographic-stats';
const htmlTemplate = TemplateLoader.readFile(`${BASE_PATH}/sociodemographic-stats.html`);
const cssStyles = TemplateLoader.readFile(`${BASE_PATH}/sociodemographic-stats.css`);

function sanitizeBackendHtml(raw?: string): string {
  if (!raw) return '';
  return raw
    .replace(/<b\s*\/>/gi, '</b>')
    .replace(/<span\s*\/>/gi, '</span>')
    .trim();
}

function renderStatDonutSvg(percentage: number): string {
  const pct = Math.min(Math.max(percentage, 0), 100);
  const r = 24;
  const circumference = 2 * Math.PI * r;
  const strokeDasharray = `${(pct / 100) * circumference} ${circumference}`;

  return `
    <div class="stat-donut-box">
      <svg width="62" height="62" viewBox="0 0 62 62" xmlns="http://www.w3.org/2000/svg">
        <circle cx="31" cy="31" r="${r}" fill="#ffffff" />
        <circle cx="31" cy="31" r="${r}" fill="none" stroke="#9ca3af" stroke-width="6.5" />
        <circle
          cx="31"
          cy="31"
          r="${r}"
          fill="none"
          stroke="#1e293b"
          stroke-width="6.5"
          stroke-dasharray="${strokeDasharray}"
          stroke-linecap="round"
          transform="rotate(-90 31 31)"
        />
        <text x="31" y="35" text-anchor="middle" fill="#0b326f" font-size="12" font-weight="700">${Math.round(pct)}%</text>
      </svg>
    </div>`;
}

export function buildSociodemographicStatsSection(data: CheckupPayloadGNP): { html: string; css: string } {
  const estadisticas = data.estadisticas;
  if (!estadisticas || !Array.isArray(estadisticas.detalleEstadisiticas)) {
    return { html: '', css: '' };
  }

  const validItems = estadisticas.detalleEstadisiticas.filter(
    (item) => (item.descripcion && item.descripcion.trim() !== '') || (item.valor && item.valor.trim() !== '')
  );

  if (validItems.length === 0) {
    return { html: '', css: '' };
  }

  const itemsHtml = validItems
    .map((item) => {
      const hasChart = typeof item.valorGrafica === 'number' && item.valorGrafica > 0;
      const donutHtml = hasChart ? renderStatDonutSvg(item.valorGrafica) : '';
      const categoryLabel = item.nombreEstadistica ? `${item.nombreEstadistica.trim()}:` : '';

      const descText = sanitizeBackendHtml(item.descripcion);
      const valueText = sanitizeBackendHtml(item.valor);
      const combinedText = [descText, valueText].filter(Boolean).join(' ');

      return `
        <div class="stat-card">
          ${donutHtml}
          <div class="stat-content">
            ${categoryLabel ? `<div class="stat-category">${categoryLabel}</div>` : ''}
            <div class="stat-desc">${combinedText}</div>
          </div>
        </div>`;
    })
    .join('');

  const html = htmlTemplate
    .replace('{{STATS_SUBTITLE}}', estadisticas.tituloDescripcion || '')
    .replace('{{STATS_ITEMS_HTML}}', itemsHtml);

  return { html, css: cssStyles };
}