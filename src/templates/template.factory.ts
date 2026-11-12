import { CheckupPayloadGNP } from '../types/checkup.types.js';
import { buildClientReportHtml } from './client/client-report.builder.js';

export class TemplateFactory {
  public static buildHtml(payload: CheckupPayloadGNP): string {
    const channel = payload.taggeo?.canal?.toLowerCase();

    if (channel === 'agentes') {
      // Cuando creemos el builder del agente, lo enrutaremos aquí
      return buildClientReportHtml(payload);
    }

    return buildClientReportHtml(payload);
  }
}