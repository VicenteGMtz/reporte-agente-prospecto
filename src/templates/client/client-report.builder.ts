import { CheckupPayloadGNP } from '../../types/checkup.types.js';
import { TemplateLoader } from '../../utils/template-loader.util.js';
import { buildCoverSection } from './sections/cover/cover.section.js';
import { buildRecommendationsSection } from './sections/recommendations/recommendations.section.js';
import { buildProtectionIncomeSection } from './sections/protection-income/protection-income.section.js';
import { buildContractedInsuranceSection } from './sections/contracted-insurance/contracted-insurance.section.js';

const layoutHtml = TemplateLoader.readFile('templates/client/layout.html');
const globalCss = TemplateLoader.readFile('assets/styles/global.css');

// Logo GNP vectorial garantizado (funciona siempre en Puppeteer headerTemplate y portada)
const GNP_LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60" width="135" height="45">
  <g transform="translate(8, 6)">
    <polygon points="24,0 28,16 24,20 20,16" fill="#ff6600"/>
    <polygon points="24,48 28,32 24,28 20,32" fill="#ff6600"/>
    <polygon points="0,24 16,20 20,24 16,28" fill="#ff6600"/>
    <polygon points="48,24 32,20 28,24 32,28" fill="#ff6600"/>
    <polygon points="7,7 19,15 20,20 15,19" fill="#ff8533"/>
    <polygon points="41,7 33,19 28,20 29,15" fill="#ff8533"/>
    <polygon points="7,41 15,29 20,28 19,33" fill="#ff8533"/>
    <polygon points="41,41 29,33 28,28 33,29" fill="#ff8533"/>
  </g>
  <text x="64" y="34" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="28" fill="#0b326f" letter-spacing="1">GNP</text>
  <text x="65" y="48" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="9.5" fill="#ff6600" letter-spacing="3.5">SEGUROS</text>
</svg>`;

const GNP_LOGO_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(GNP_LOGO_SVG.trim()).toString('base64')}`;

export interface BuiltReportResult {
  html: string;
  logoSrc: string;
  analysisDate: string;
}

export function buildClientReportHtml(data: CheckupPayloadGNP): BuiltReportResult {
  const localLogo = TemplateLoader.getImageBase64('logo-gnp.png') || GNP_LOGO_DATA_URI;
  const coverLogo = data.headers?.urlImgLogo || localLogo;

  let formattedDate = '09/10/2026';
  if (data.intermediario?.fechaAnalisis) {
    formattedDate =
      data.intermediario.fechaAnalisis instanceof Date
        ? data.intermediario.fechaAnalisis.toLocaleDateString('es-MX')
        : String(data.intermediario.fechaAnalisis);
  }

  const cover = buildCoverSection(data, coverLogo, formattedDate);
  const recommendations = buildRecommendationsSection(data);
  const protectionIncome = buildProtectionIncomeSection(data);
  const contractedInsurance = buildContractedInsuranceSection(data);

  const combinedCss = [
    globalCss,
    cover.css,
    recommendations.css,
    protectionIncome.css,
    contractedInsurance.css,
  ].join('\n');

  const html = layoutHtml
    .replace('{{ALL_STYLES}}', combinedCss)
    .replaceAll('{{LOGO_GNP_SRC}}', coverLogo)
    .replaceAll('{{FECHA_ANALISIS}}', formattedDate)
    .replace('{{SECTION_COVER}}', cover.html)
    .replace('{{SECTION_RECOMMENDATIONS}}', recommendations.html)
    .replace('{{SECTION_PROTECTION_INCOME}}', protectionIncome.html)
    .replace('{{SECTION_CONTRACTED_INSURANCE}}', contractedInsurance.html);

  return {
    html,
    logoSrc: localLogo,
    analysisDate: formattedDate,
  };
}