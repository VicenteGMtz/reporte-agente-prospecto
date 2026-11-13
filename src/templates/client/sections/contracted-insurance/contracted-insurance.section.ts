import { CheckupPayloadGNP, SeguroContratadoItem } from '../../../../types/checkup.types.js';
import { TemplateLoader } from '../../../../utils/template-loader.util.js';

const BASE_PATH = 'templates/client/sections/contracted-insurance';
const htmlTemplate = TemplateLoader.readFile(`${BASE_PATH}/contracted-insurance.html`);
const cssStyles = TemplateLoader.readFile(`${BASE_PATH}/contracted-insurance.css`);

const CHEVRON_UP_SVG = `
<svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 15L12 9L18 15" stroke="#ff6600" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

function getRowColorClass(branchName: string): string {
  const normalized = branchName.toLowerCase();
  if (normalized.includes('vida')) return 'row-vida';
  if (
    normalized.includes('gmm') ||
    normalized.includes('médico') ||
    normalized.includes('medico') ||
    normalized.includes('salud') ||
    normalized.includes('imss')
  ) {
    return 'row-gmm';
  }
  if (normalized.includes('auto') || normalized.includes('daño') || normalized.includes('mascota')) {
    return 'row-autos';
  }
  if (normalized.includes('retiro')) return 'row-retiro';
  if (normalized.includes('ahorro')) return 'row-ahorro';
  return 'row-default';
}

function formatCurrency(amount?: number | string): string {
  if (amount === undefined || amount === null || amount === '') return '';
  const numeric = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;
  if (isNaN(numeric) || numeric <= 0) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}

function renderInsuranceGroup(title: string, policies?: SeguroContratadoItem[]): string {
  if (!Array.isArray(policies)) return '';

  // Filtrar únicamente los seleccionados
  const activePolicies = policies.filter((p) => p.seleccionado !== false && p.valorRespuesta);
  if (activePolicies.length === 0) return '';

  const rowsHtml = activePolicies
    .map((policy) => {
      const branch = policy.valorRespuesta.trim();
      const colorClass = getRowColorClass(branch);
      const formattedSum = formatCurrency(policy.sumaAsegurada);
      const hasPoliciesCount =
        policy.numeroPolizas !== undefined &&
        policy.numeroPolizas !== null &&
        String(policy.numeroPolizas).trim() !== '';

      // Construir segmentos dinámicos solo con los datos disponibles
      const segments: string[] = [`<span class="insurance-branch">${branch}</span>`];

      if (formattedSum) {
        segments.push(`<span class="insurance-divider">|</span>`);
        segments.push(`<span class="insurance-detail">Suma asegurada: <strong>${formattedSum}</strong></span>`);
      }

      if (hasPoliciesCount) {
        segments.push(`<span class="insurance-divider">|</span>`);
        segments.push(`<span class="insurance-detail">Pólizas: <strong>${policy.numeroPolizas}</strong></span>`);
      }

      return `<div class="insurance-row ${colorClass}">${segments.join('')}</div>`;
    })
    .join('');

  return `
    <div class="insurance-group">
      <div class="accordion-header">
        <span class="accordion-title">${title}</span>
        ${CHEVRON_UP_SVG}
      </div>
      ${rowsHtml}
    </div>`;
}

export function buildContractedInsuranceSection(data: CheckupPayloadGNP): { html: string; css: string } {
  const clientBlockHtml = renderInsuranceGroup(
    'Seguros contratados por usted',
    data.segurosContratadosPorTuCuenta
  );

  const companyBlockHtml = renderInsuranceGroup(
    'Seguros contratados por su empresa',
    data.segurosContratadosPorTuEmpresa
  );

  const html = htmlTemplate
    .replace('{{CLIENT_INSURANCE_BLOCK}}', clientBlockHtml)
    .replace('{{COMPANY_INSURANCE_BLOCK}}', companyBlockHtml);

  return { html, css: cssStyles };
}