import { CheckupPayloadGNP } from '../../../../types/checkup.types.js';
import { TemplateLoader } from '../../../../utils/template-loader.util.js';
import { buildMexicoMapHtml } from '../../../../utils/mexico-map.util.js';

const BASE_PATH = 'templates/client/sections/local-risks';
const htmlTemplate = TemplateLoader.readFile(`${BASE_PATH}/local-risks.html`);
const cssStyles = TemplateLoader.readFile(`${BASE_PATH}/local-risks.css`);

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function extractStateFromAddress(address?: string): string {
  if (!address) return '';
  const parts = address.split(',');
  return parts.length > 1 ? parts[parts.length - 1].trim() : address.trim();
}

function getLevelVisualConfig(levelName: string): { colorHex: string; cardClass: string } {
  const norm = normalizeText(levelName);
  if (norm.includes('critico') && !norm.includes('no critico')) {
    return { colorHex: '#dc2626', cardClass: 'risk-card-critico' };
  }
  if (norm.includes('medio') || norm.includes('moderado')) {
    return { colorHex: '#d97706', cardClass: 'risk-card-medio' };
  }
  return { colorHex: '#65a30d', cardClass: 'risk-card-bajo' };
}

function renderRiskIconSvg(riskName: string, colorHex: string): string {
  const norm = normalizeText(riskName);

  // Terremoto / Sismo (muro / estructura)
  if (norm.includes('terremoto') || norm.includes('sismo')) {
    return `
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${colorHex}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="9" />
        <line x1="15" y1="9" x2="15" y2="15" />
        <line x1="9" y1="15" x2="9" y2="21" />
      </svg>`;
  }

  // Hidrometeorológicos (nube con lluvia)
  if (norm.includes('hidro') || norm.includes('meteorol') || norm.includes('lluvia') || norm.includes('huracan')) {
    return `
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${colorHex}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        <line x1="9" y1="20" x2="8" y2="22" />
        <line x1="13" y1="20" x2="12" y2="22" />
        <line x1="17" y1="20" x2="16" y2="22" />
      </svg>`;
  }

  // Incendio / Fuego
  if (norm.includes('incendio') || norm.includes('fuego')) {
    return `
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${colorHex}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>`;
  }

  // General
  return `
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${colorHex}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>`;
}

export function buildLocalRisksSection(
  data: CheckupPayloadGNP,
  isAgent: boolean = data.taggeo?.canal?.toLowerCase() === 'agentes'
): { html: string; css: string } {
  const fullLocation =
    data.cliente?.infoPersonal?.direccion || data.cliente?.contacto?.direccion || '';
  const clientStateNorm = normalizeText(extractStateFromAddress(fullLocation));
  const mapHtml = buildMexicoMapHtml(data.cliente?.infoPersonal?.codigoPostal);

  const riskTypes = Array.isArray(data.tipoRiesgo) ? data.tipoRiesgo : [];
  const riskCards: string[] = [];

  for (const risk of riskTypes) {
    if (!risk.activo || !Array.isArray(risk.nivelRiesgos)) continue;

    const matchedLevel = risk.nivelRiesgos.find((lvl) => {
      if (!lvl.estadosRepublicaMexicana) return false;
      const statesList = lvl.estadosRepublicaMexicana.split(',').map((s) => normalizeText(s));
      return clientStateNorm ? statesList.includes(clientStateNorm) : false;
    });

    if (!matchedLevel) continue;

    const levelLabel = matchedLevel.nombreNivelRiesgo.trim();
    const { colorHex, cardClass } = getLevelVisualConfig(levelLabel);
    const iconSvg = renderRiskIconSvg(risk.nombreTipoRiesgo, colorHex);
    const basePhrase = (risk.fraseTipoRiesgo || '').trim();

    riskCards.push(`
      <div class="risk-card ${cardClass}">
        <div class="risk-content">
          <div class="risk-name">${risk.nombreTipoRiesgo.trim()}</div>
          <div class="risk-desc">${basePhrase} ${levelLabel.toLowerCase()}.</div>
        </div>
        <div class="risk-icon-right">${iconSvg}</div>
      </div>`);
  }

  // Asegurar formato limpio de fuentes con asterisco inicial
  const rawSources =
    data.estadisticas?.fuentesInformacion?.trim() ||
    'Fuentes de información: Análisis multivariable con datos de INEGI, BBVA y SSN.';
  const formattedSources = rawSources.startsWith('*') ? rawSources : `* ${rawSources}`;

  const closingFooterHtml = isAgent
    ? `
      <div class="report-closing-box">
        <div class="closing-notes-list">
          <p class="closing-note-item">${formattedSources}</p>
          <p class="closing-note-item">* Este reporte es de uso exclusivo para intermediarios, el cliente/prospecto tendrá su propio reporte.</p>
        </div>
      </div>`
    : `
      <div class="report-closing-box">
        <div class="closing-cta-pill">
          Contacte a su Agente GNP para recibir mayor asesoría
        </div>
        <div class="closing-notes-list">
          <p class="closing-note-item">${formattedSources}</p>
        </div>
      </div>`;

  const html = htmlTemplate
    .replace('{{CLIENT_LOCATION}}', fullLocation)
    .replace('{{MEXICO_MAP_HTML}}', mapHtml)
    .replace('{{RISKS_ITEMS_HTML}}', riskCards.join(''))
    .replace('{{CLOSING_FOOTER_HTML}}', closingFooterHtml);

  return { html, css: cssStyles };
}