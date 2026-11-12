import { CheckupPayloadGNP } from '../../types/checkup.types.js';
import { TemplateLoader } from '../../utils/template-loader.util.js';
import { buildCoverSection } from './sections/cover/cover.section.js';
import { buildRecommendationsSection } from './sections/recommendations/recommendations.section.js';
import { buildProtectionIncomeSection } from './sections/protection-income/protection-income.section.js';

const layoutHtml = TemplateLoader.readFile('templates/client/layout.html');
const globalCss = TemplateLoader.readFile('assets/styles/global.css');

export function buildClientReportHtml(data: CheckupPayloadGNP): string {
  const logoGnp = data.headers?.urlImgLogo || TemplateLoader.getImageBase64('logo-gnp.png');

  let formattedDate = '09/10/2026';
  if (data.intermediario?.fechaAnalisis) {
    formattedDate =
      data.intermediario.fechaAnalisis instanceof Date
        ? data.intermediario.fechaAnalisis.toLocaleDateString('es-MX')
        : String(data.intermediario.fechaAnalisis);
  }

  // 1. Ejecutar cada sección independiente
  const cover = buildCoverSection(data, logoGnp, formattedDate);
  const recommendations = buildRecommendationsSection(data);
  const protectionIncome = buildProtectionIncomeSection(data);

  // 2. Unir todo el CSS (global + secciones)
  const combinedCss = [
    globalCss,
    cover.css,
    recommendations.css,
    protectionIncome.css,
  ].join('\n');

  // 3. Inyectar en el layout principal
  return layoutHtml
    .replace('{{ALL_STYLES}}', combinedCss)
    .replaceAll('{{LOGO_GNP_SRC}}', logoGnp)
    .replaceAll('{{FECHA_ANALISIS}}', formattedDate)
    .replace('{{SECTION_COVER}}', cover.html)
    .replace('{{SECTION_RECOMMENDATIONS}}', recommendations.html)
    .replace('{{SECTION_PROTECTION_INCOME}}', protectionIncome.html);
}