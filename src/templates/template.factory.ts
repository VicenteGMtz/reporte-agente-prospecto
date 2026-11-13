import { CheckupPayloadGNP } from '../types/checkup.types.js';
import { buildClientReportHtml, BuiltReportResult } from './client/client-report.builder.js';

export class TemplateFactory {
  public static buildHtml(payload: CheckupPayloadGNP): BuiltReportResult {
    const channel = payload.taggeo?.canal?.toLowerCase();

    if (channel === 'agentes') {
      // Futuro enrutamiento al builder de agente
      return buildClientReportHtml(payload);
    }

    return buildClientReportHtml(payload);
  }
}