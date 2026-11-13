import type { Browser, Page } from 'puppeteer-core';

export interface PdfRenderOptions {
  logoSrc: string;
  analysisDate: string;
}

export class PdfGeneratorService {
  public static async htmlToPdf(htmlContent: string, options: PdfRenderOptions): Promise<Uint8Array> {
    const isCloud = Boolean(
      process.env.K_SERVICE || process.env.FUNCTION_TARGET || process.env.GOOGLE_CLOUD_PROJECT
    );

    let browser: Browser;

    if (isCloud) {
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
        displayHeaderFooter: true,
        headerTemplate: `
          <style>
            #header { padding: 0 !important; margin: 0 !important; }
          </style>
          <div style="width: 100%; height: 20mm; padding: 0 16mm; box-sizing: border-box; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; background: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; -webkit-print-color-adjust: exact;">
            <img src="${options.logoSrc}" style="height: 32px; width: auto; display: block;" />
            <span style="font-size: 12px; color: #0b326f; font-weight: 500;">Fecha de análisis: ${options.analysisDate}</span>
          </div>
        `,
        footerTemplate: '<div></div>',
      });
      
    } finally {
      await browser.close();
    }
  }
}