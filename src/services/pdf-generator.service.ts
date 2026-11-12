import type { Browser, Page } from 'puppeteer-core';

export class PdfGeneratorService {
  public static async htmlToPdf(htmlContent: string): Promise<Uint8Array> {
    const isCloud = Boolean(
      process.env.K_SERVICE || process.env.FUNCTION_TARGET || process.env.GOOGLE_CLOUD_PROJECT
    );

    let browser: Browser;

    if (isCloud) {
      // Importación dinámica: solo se evalúa al correr en GCP
      const [{ default: puppeteerCore }, { default: chromium }] = await Promise.all([
        import('puppeteer-core'),
        import('@sparticuz/chromium'),
      ]);

      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      // Entorno local (Mac / Windows)
      const { default: puppeteer } = await import('puppeteer');
      browser = (await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })) as unknown as Browser;
    }

    try {
      const page: Page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
      await page.evaluateHandle('document.fonts.ready');

      return await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
      });
    } finally {
      await browser.close();
    }
  }
}