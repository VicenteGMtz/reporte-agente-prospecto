import { CheckupPayloadGNP } from '../../types/checkup.types.js';
import { TemplateLoader } from '../../utils/template-loader.util.js';
import { buildCoverSection } from './sections/cover/cover.section.js';
import { buildRecommendationsSection } from './sections/recommendations/recommendations.section.js';
import { buildProtectionIncomeSection } from './sections/protection-income/protection-income.section.js';
import { buildContractedInsuranceSection } from './sections/contracted-insurance/contracted-insurance.section.js';

const layoutHtml = TemplateLoader.readFile('templates/client/layout.html');
const globalCss = TemplateLoader.readFile('assets/styles/global.css');

export interface BuiltReportResult {
  html: string;
  logoSrc: string;
  analysisDate: string;
}

export function buildClientReportHtml(data: CheckupPayloadGNP): BuiltReportResult {
  const localLogoBase64 = TemplateLoader.getImageBase64('logo-gnp.png');
  const logoGnp = data.headers?.urlImgLogo || localLogoBase64;

  let formattedDate = '09/10/2026';
  if (data.intermediario?.fechaAnalisis) {
    formattedDate =
      data.intermediario.fechaAnalisis instanceof Date
        ? data.intermediario.fechaAnalisis.toLocaleDateString('es-MX')
        : String(data.intermediario.fechaAnalisis);
  }

  const cover = buildCoverSection(data, logoGnp, formattedDate);
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
    .replaceAll('{{LOGO_GNP_SRC}}', logoGnp)
    .replaceAll('{{FECHA_ANALISIS}}', formattedDate)
    .replace('{{SECTION_COVER}}', cover.html)
    .replace('{{SECTION_RECOMMENDATIONS}}', recommendations.html)
    .replace('{{SECTION_PROTECTION_INCOME}}', protectionIncome.html)
    .replace('{{SECTION_CONTRACTED_INSURANCE}}', contractedInsurance.html);

  return {
    html,
    // Siempre Base64 local para el headerTemplate nativo de Puppeteer
    logoSrc: localLogoBase64,
    analysisDate: formattedDate,
  };
}