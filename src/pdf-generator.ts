import puppeteer, { Browser, Page } from 'puppeteer';
import { CheckupReportData } from './types/checkup.types.js';
import { renderCheckupHtml } from './templates/report.template.js';

export class PdfGeneratorService {
  public static async generateCheckupPdf(data: CheckupReportData): Promise<Uint8Array> {
    const browser: Browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page: Page = await browser.newPage();
      const htmlContent: string = renderCheckupHtml(data);

      // Usar 'domcontentloaded' o 'load' válido según el tipo de TS
      await page.setContent(htmlContent, {
        waitUntil: 'domcontentloaded',
      });

      // Asegurar que las fuentes web terminen de renderizarse antes del print
      await page.evaluateHandle('document.fonts.ready');

      const pdfBuffer: Uint8Array = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
      });

      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }
}