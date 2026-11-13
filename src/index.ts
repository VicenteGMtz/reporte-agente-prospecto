import { http } from '@google-cloud/functions-framework';
import { TemplateFactory } from './templates/template.factory.js';
import { PdfGeneratorService } from './services/pdf-generator.service.js';
import { CheckupPayloadGNP } from './types/checkup.types.js';

http('generarPdf', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  try {
    const payload = req.body as CheckupPayloadGNP;

    if (!payload?.cliente?.infoPersonal || !payload?.estatusSaud || !payload?.indDestacados) {
      res.status(400).json({ error: 'Incomplete payload structure.' });
      return;
    }

    const clientName = payload.cliente.infoPersonal.nombre || 'report';
    console.log(`Generating PDF for: ${clientName}`);

    // Obtiene HTML y datos del header repetitivo
    const { html, logoSrc, analysisDate } = TemplateFactory.buildHtml(payload);
    const pdfBytes = await PdfGeneratorService.htmlToPdf(html, { logoSrc, analysisDate });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="checkup_${encodeURIComponent(clientName)}.pdf"`,
      'Content-Length': pdfBytes.length.toString(),
    });

    res.status(200).end(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      error: 'Internal error generating PDF',
      details: (error as Error).message,
    });
  }
});