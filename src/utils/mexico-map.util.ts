import { TemplateLoader } from './template-loader.util.js';

interface PostalStateInfo {
  svgId: string;
  estadoName: string;
}

const POSTAL_PREFIX_DATA: Record<string, PostalStateInfo> = {
  '01': { svgId: 'MXCMX', estadoName: 'Ciudad de México' },
  '02': { svgId: 'MXCMX', estadoName: 'Ciudad de México' },
  '03': { svgId: 'MXCMX', estadoName: 'Ciudad de México' },
  '04': { svgId: 'MXCMX', estadoName: 'Ciudad de México' },
  '05': { svgId: 'MXCMX', estadoName: 'Ciudad de México' },
  '06': { svgId: 'MXCMX', estadoName: 'Ciudad de México' },
  '07': { svgId: 'MXCMX', estadoName: 'Ciudad de México' },
  '08': { svgId: 'MXCMX', estadoName: 'Ciudad de México' },
  '09': { svgId: 'MXCMX', estadoName: 'Ciudad de México' },
  '10': { svgId: 'MXCMX', estadoName: 'Ciudad de México' },
  '11': { svgId: 'MXCMX', estadoName: 'Ciudad de México' },
  '12': { svgId: 'MXCMX', estadoName: 'Ciudad de México' },
  '13': { svgId: 'MXCMX', estadoName: 'Ciudad de México' },
  '14': { svgId: 'MXCMX', estadoName: 'Ciudad de México' },
  '15': { svgId: 'MXCMX', estadoName: 'Ciudad de México' },
  '16': { svgId: 'MXCMX', estadoName: 'Ciudad de México' },
  '20': { svgId: 'MXAGU', estadoName: 'Aguascalientes' },
  '21': { svgId: 'MXBCN', estadoName: 'Baja California' },
  '22': { svgId: 'MXBCN', estadoName: 'Baja California' },
  '23': { svgId: 'MXBCS', estadoName: 'Baja California Sur' },
  '24': { svgId: 'MXCAM', estadoName: 'Campeche' },
  '25': { svgId: 'MXCOA', estadoName: 'Coahuila' },
  '26': { svgId: 'MXCOA', estadoName: 'Coahuila' },
  '27': { svgId: 'MXCOA', estadoName: 'Coahuila' },
  '28': { svgId: 'MXCOL', estadoName: 'Colima' },
  '29': { svgId: 'MXCHP', estadoName: 'Chiapas' },
  '30': { svgId: 'MXCHP', estadoName: 'Chiapas' },
  '31': { svgId: 'MXCHH', estadoName: 'Chihuahua' },
  '32': { svgId: 'MXCHH', estadoName: 'Chihuahua' },
  '33': { svgId: 'MXCHH', estadoName: 'Chihuahua' },
  '34': { svgId: 'MXDUR', estadoName: 'Durango' },
  '35': { svgId: 'MXDUR', estadoName: 'Durango' },
  '36': { svgId: 'MXGUA', estadoName: 'Guanajuato' },
  '37': { svgId: 'MXGUA', estadoName: 'Guanajuato' },
  '38': { svgId: 'MXGUA', estadoName: 'Guanajuato' },
  '39': { svgId: 'MXGRO', estadoName: 'Guerrero' },
  '40': { svgId: 'MXGRO', estadoName: 'Guerrero' },
  '41': { svgId: 'MXGRO', estadoName: 'Guerrero' },
  '42': { svgId: 'MXHID', estadoName: 'Hidalgo' },
  '43': { svgId: 'MXHID', estadoName: 'Hidalgo' },
  '44': { svgId: 'MXJAL', estadoName: 'Jalisco' },
  '45': { svgId: 'MXJAL', estadoName: 'Jalisco' },
  '46': { svgId: 'MXJAL', estadoName: 'Jalisco' },
  '47': { svgId: 'MXJAL', estadoName: 'Jalisco' },
  '48': { svgId: 'MXJAL', estadoName: 'Jalisco' },
  '49': { svgId: 'MXJAL', estadoName: 'Jalisco' },
  '50': { svgId: 'MXMEX', estadoName: 'Estado de México' },
  '51': { svgId: 'MXMEX', estadoName: 'Estado de México' },
  '52': { svgId: 'MXMEX', estadoName: 'Estado de México' },
  '53': { svgId: 'MXMEX', estadoName: 'Estado de México' },
  '54': { svgId: 'MXMEX', estadoName: 'Estado de México' },
  '55': { svgId: 'MXMEX', estadoName: 'Estado de México' },
  '56': { svgId: 'MXMEX', estadoName: 'Estado de México' },
  '57': { svgId: 'MXMEX', estadoName: 'Estado de México' },
  '58': { svgId: 'MXMIC', estadoName: 'Michoacán' },
  '59': { svgId: 'MXMIC', estadoName: 'Michoacán' },
  '60': { svgId: 'MXMIC', estadoName: 'Michoacán' },
  '61': { svgId: 'MXMIC', estadoName: 'Michoacán' },
  '62': { svgId: 'MXMOR', estadoName: 'Morelos' },
  '63': { svgId: 'MXNAY', estadoName: 'Nayarit' },
  '64': { svgId: 'MXNLE', estadoName: 'Nuevo León' },
  '65': { svgId: 'MXNLE', estadoName: 'Nuevo León' },
  '66': { svgId: 'MXNLE', estadoName: 'Nuevo León' },
  '67': { svgId: 'MXNLE', estadoName: 'Nuevo León' },
  '68': { svgId: 'MXOAX', estadoName: 'Oaxaca' },
  '69': { svgId: 'MXOAX', estadoName: 'Oaxaca' },
  '70': { svgId: 'MXOAX', estadoName: 'Oaxaca' },
  '71': { svgId: 'MXOAX', estadoName: 'Oaxaca' },
  '72': { svgId: 'MXPUE', estadoName: 'Puebla' },
  '73': { svgId: 'MXPUE', estadoName: 'Puebla' },
  '74': { svgId: 'MXPUE', estadoName: 'Puebla' },
  '75': { svgId: 'MXPUE', estadoName: 'Puebla' },
  '76': { svgId: 'MXQUE', estadoName: 'Querétaro' },
  '77': { svgId: 'MXROO', estadoName: 'Quintana Roo' },
  '78': { svgId: 'MXSLP', estadoName: 'San Luis Potosí' },
  '79': { svgId: 'MXSLP', estadoName: 'San Luis Potosí' },
  '80': { svgId: 'MXSIN', estadoName: 'Sinaloa' },
  '81': { svgId: 'MXSIN', estadoName: 'Sinaloa' },
  '82': { svgId: 'MXSIN', estadoName: 'Sinaloa' },
  '83': { svgId: 'MXSON', estadoName: 'Sonora' },
  '84': { svgId: 'MXSON', estadoName: 'Sonora' },
  '85': { svgId: 'MXSON', estadoName: 'Sonora' },
  '86': { svgId: 'MXTAB', estadoName: 'Tabasco' },
  '87': { svgId: 'MXTAM', estadoName: 'Tamaulipas' },
  '88': { svgId: 'MXTAM', estadoName: 'Tamaulipas' },
  '89': { svgId: 'MXTAM', estadoName: 'Tamaulipas' },
  '90': { svgId: 'MXTLA', estadoName: 'Tlaxcala' },
  '91': { svgId: 'MXVER', estadoName: 'Veracruz' },
  '92': { svgId: 'MXVER', estadoName: 'Veracruz' },
  '93': { svgId: 'MXVER', estadoName: 'Veracruz' },
  '94': { svgId: 'MXVER', estadoName: 'Veracruz' },
  '95': { svgId: 'MXVER', estadoName: 'Veracruz' },
  '96': { svgId: 'MXVER', estadoName: 'Veracruz' },
  '97': { svgId: 'MXYUC', estadoName: 'Yucatán' },
  '98': { svgId: 'MXZAC', estadoName: 'Zacatecas' },
  '99': { svgId: 'MXZAC', estadoName: 'Zacatecas' },
};

const STATE_COLOR = '#D6E0F2';
const SELECTED_STATE_COLOR = '#FF6B0B';
const STATE_STROKE_COLOR = '#FFFFFF';
const SHADOW_COLOR = '#D1D1D1';

let cachedCleanSvg: string | null = null;

function getCleanBaseSvg(): string {
  if (cachedCleanSvg !== null) return cachedCleanSvg;
  const rawSvg = TemplateLoader.readFile('assets/images/mx.svg');
  if (!rawSvg) {
    cachedCleanSvg = '';
    return '';
  }

  // Replica removeCityDots() de Angular eliminando todos los <circle .../>
  cachedCleanSvg = rawSvg.replace(/<circle\b[^>]*\/?>/gi, '');
  return cachedCleanSvg;
}

export function getSvgIdFromPostalCode(postalCode?: string | number | null): string {
  if (postalCode === undefined || postalCode === null) return '';
  const digits = String(postalCode).replace(/\D/g, '');
  if (!digits) return '';
  const prefix = digits.padStart(5, '0').slice(0, 2);
  return POSTAL_PREFIX_DATA[prefix]?.svgId || '';
}

export function buildMexicoMapHtml(postalCode?: string | number | null): string {
  const baseSvg = getCleanBaseSvg();
  if (!baseSvg) return '';

  const selectedSvgId = getSvgIdFromPostalCode(postalCode);

  // 1. Capa de sombra: replica prepareShadowMap() (#D1D1D1, sin borde)
  const shadowSvg = baseSvg.replace(/<path\b([^>]*)>/gi, (_match, attrs: string) => {
    const cleanAttrs = attrs
      .replace(/\s*(fill|stroke|stroke-width|style)="[^"]*"/gi, '');
    return `<path${cleanAttrs} fill="${SHADOW_COLOR}" stroke="none" stroke-width="0">`;
  });

  // 2. Capa principal: replica prepareMap() + paintSelectedState()
  const mainSvg = baseSvg.replace(/<path\b([^>]*)>/gi, (_match, attrs: string) => {
    const idMatch = attrs.match(/\bid="([^"]+)"/i);
    const pathId = idMatch ? idMatch[1] : '';
    const isSelected = Boolean(selectedSvgId && pathId === selectedSvgId);
    const fillColor = isSelected ? SELECTED_STATE_COLOR : STATE_COLOR;

    const cleanAttrs = attrs
      .replace(/\s*(fill|stroke|stroke-width|stroke-linejoin|stroke-linecap|style)="[^"]*"/gi, '');

    return `<path${cleanAttrs} fill="${fillColor}" stroke="${STATE_STROKE_COLOR}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">`;
  });

  return `
    <div class="map-wrapper">
      <div class="svg-shadow">${shadowSvg}</div>
      <div class="svg-host">${mainSvg}</div>
    </div>`;
}