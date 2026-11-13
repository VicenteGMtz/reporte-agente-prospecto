import { CheckupPayloadGNP } from '../../../../types/checkup.types.js';
import { TemplateLoader } from '../../../../utils/template-loader.util.js';

const BASE_PATH = 'templates/client/sections/protection-income';
const htmlTemplate = TemplateLoader.readFile(`${BASE_PATH}/protection-income.html`);
const cssStyles = TemplateLoader.readFile(`${BASE_PATH}/protection-income.css`);

const ICON_EXPENSES_SVG = `
<svg class="ingreso-card-icono" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="14" width="26" height="18" rx="4" fill="#cbd5e1"/>
  <path d="M10 14L20 7L27 14H10Z" fill="#0066cc"/>
  <path d="M31 7V15M31 7L28 10M31 7L34 10" stroke="#0066cc" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="23" y="20" width="11" height="6" rx="3" fill="#94a3b8"/>
  <circle cx="26" cy="23" r="1.5" fill="#ffffff"/>
</svg>`;

const ICON_SAVINGS_SVG = `
<svg class="ingreso-card-icono" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 11L15 7H25L23 11H17Z" fill="#0b326f"/>
  <path d="M13 14C13 12 16 11 20 11C24 11 27 12 27 14C30 17 31 23 28 26C25 28 15 28 12 26C9 23 10 17 13 14Z" fill="#0066cc"/>
  <text x="20" y="23" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="bold">$</text>
  <rect x="7" y="25" width="4" height="9" rx="1" fill="#0066cc"/>
  <path d="M11 28H23C25 28 27 29 29 27L33 25C34 25 34 27 33 28L27 32C25 33 22 33 19 33H11V28Z" fill="#cbd5e1"/>
</svg>`;

const ICON_CLOCK_COIN_SVG = `
<svg class="ingreso-card-icono" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="15" cy="14" r="7" fill="#e2e8f0" stroke="#0066cc" stroke-width="2"/>
  <path d="M15 10V14L17.5 16" stroke="#0066cc" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="27" cy="14" r="7" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
  <text x="27" y="18" text-anchor="middle" fill="#0066cc" font-size="10" font-weight="bold">$</text>
  <rect x="7" y="25" width="4" height="9" rx="1" fill="#0066cc"/>
  <path d="M11 28H23C25 28 27 29 29 27L33 25C34 25 34 27 33 28L27 32C25 33 22 33 19 33H11V28Z" fill="#cbd5e1"/>
</svg>`;

function getTrafficLightColor(value: number): string {
  if (value >= 75) return '#6ab04c';
  if (value >= 45) return '#f1c40f';
  if (value >= 25) return '#e67e22';
  if (value > 10) return '#eb2f06';
  return '#4a0e0e';
}

function buildProtectionDonutSvg(indicators: { clave: string; nombre: string; valor: number }[]): string {
  const getVal = (key: string) => indicators.find((i) => i.clave === key)?.valor ?? 0;

  const segments = [
    { key: 'RE', label: 'Retiro', value: getVal('RE'), startDeg: -82, endDeg: -38, lx: 222, ly: 42 },
    { key: 'VI', label: 'Protección', value: getVal('VI'), startDeg: -22, endDeg: 22, lx: 256, ly: 142 },
    { key: 'AE', label: 'Ahorro', value: getVal('AE'), startDeg: 38, endDeg: 82, lx: 222, ly: 245 },
    { key: 'SA', label: 'GMM', value: getVal('SA'), startDeg: 98, endDeg: 142, lx: 68, ly: 245 },
    { key: 'AU', label: 'Autos', value: getVal('AU'), startDeg: 158, endDeg: 202, lx: 34, ly: 142 },
    { key: 'DN', label: 'Daños', value: getVal('DN'), startDeg: 218, endDeg: 262, lx: 68, ly: 42 },
  ];

  const cx = 145;
  const cy = 145;
  const r = 76;

  const polarToCartesian = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const arcsHtml = segments
    .map((seg) => {
      const p1 = polarToCartesian(seg.startDeg);
      const p2 = polarToCartesian(seg.endDeg);
      const bgPath = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${r} ${r} 0 0 1 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;

      const visualPct = Math.max(seg.value, 4) / 100;
      const activeEndDeg = seg.startDeg + (seg.endDeg - seg.startDeg) * visualPct;
      const pActive = polarToCartesian(activeEndDeg);
      const fgPath = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${r} ${r} 0 0 1 ${pActive.x.toFixed(1)} ${pActive.y.toFixed(1)}`;
      const color = getTrafficLightColor(seg.value);

      return `
        <path d="${bgPath}" fill="none" stroke="#dcdde1" stroke-width="14" stroke-linecap="round" />
        <path d="${fgPath}" fill="none" stroke="${color}" stroke-width="14" stroke-linecap="round" />
        <text x="${seg.lx}" y="${seg.ly}" text-anchor="middle" class="dona-label-pct">${Math.round(seg.value)}%</text>
        <text x="${seg.lx}" y="${seg.ly + 14}" text-anchor="middle" class="dona-label-name">${seg.label}</text>
      `;
    })
    .join('');

  return `
  <svg class="dona-svg" viewBox="0 0 290 290" xmlns="http://www.w3.org/2000/svg">
    ${arcsHtml}
    <circle cx="${cx}" cy="${cy}" r="50" fill="#0066cc" />
    <path d="M 145 95 A 50 50 0 0 1 180 180 L 125 140 Z" fill="#004c99" opacity="0.45" />
    <path d="M 110 136 L 180 136 L 175 145 L 180 154 L 110 154 L 115 145 Z" fill="#ffffff" />
    <path d="M 145 114 L 168 123 L 168 144 C 168 159 145 172 145 172 C 145 172 122 159 122 144 L 122 123 Z" fill="#e6b83a" stroke="#e2e8f0" stroke-width="4" stroke-linejoin="round" />
  </svg>`;
}

export function buildProtectionIncomeSection(data: CheckupPayloadGNP): { html: string; css: string } {
  const indicatorsList = data.indDestacados?.indDestacados || [];
  const getIndicator = (name: string) =>
    indicatorsList.find((i) => i.nombreIndicador.toLowerCase().includes(name.toLowerCase()));

  const incomeRange = getIndicator('Ingresos')?.valor || '$0';
  const expensesPct = parseInt(getIndicator('Gastos')?.valor || '0', 10);
  const savingsPct = parseInt(getIndicator('Ahorro')?.valor || '0', 10);
  const leisurePct = parseInt(getIndicator('Esparcimiento')?.valor || '0', 10);

  const timeIndicator = getIndicator('Tiempo Ahorrado');
  const savingYears = timeIndicator?.valor || '0';
  const savingBarPct = timeIndicator?.indicador
    ? Math.min(Math.round(timeIndicator.indicador * 100), 100)
    : Math.min((parseInt(savingYears, 10) || 0) * 10, 100);

  const donutSvg = buildProtectionDonutSvg(data.nivelProteccion?.indicadoresProteccion || []);

  const html = htmlTemplate
    .replace('{{DONA_PROTECCION_SVG}}', donutSvg)
    .replace('{{RANGO_INGRESO}}', incomeRange)
    .replaceAll('{{GASTOS_PCT}}', String(expensesPct))
    .replaceAll('{{AHORRO_PCT}}', String(savingsPct))
    .replace('{{TIEMPO_AHORRO_ANIOS}}', savingYears)
    .replace('{{TIEMPO_AHORRO_BARRA_PCT}}', String(savingBarPct))
    .replaceAll('{{ESPARCIMIENTO_PCT}}', String(leisurePct))
    .replace('{{ICONO_GASTOS_SVG}}', ICON_EXPENSES_SVG)
    .replace('{{ICONO_AHORRO_SVG}}', ICON_SAVINGS_SVG)
    .replace('{{ICONO_TIEMPO_SVG}}', ICON_CLOCK_COIN_SVG)
    .replace('{{ICONO_ESPARCIMIENTO_SVG}}', ICON_CLOCK_COIN_SVG);

  return { html, css: cssStyles };
}