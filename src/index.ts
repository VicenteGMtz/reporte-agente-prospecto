import { HttpFunction } from '@google-cloud/functions-framework';
import { PdfGeneratorService } from './pdf-generator.js';
import { CheckupPayloadGNP } from './types/checkup.types.js';

export const generarPdf: HttpFunction = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido. Usa POST.' });
    return;
  }

  try {
    const payload = req.body as CheckupPayloadGNP;

    // Validación alineada al JSON real
    if (!payload?.cliente?.infoPersonal || !payload?.estatusSaud || !payload?.indDestacados) {
      res.status(400).json({ error: 'Estructura de datos incompleta: falta cliente.infoPersonal, estatusSaud o indDestacados.' });
      return;
    }

    const nombreProspecto = payload.cliente.infoPersonal.nombre || payload.taggeo?.nombreProspecto || 'Cliente';
    console.log(`Generando PDF para: ${nombreProspecto}`);

    const pdfBytes = await PdfGeneratorService.generateCheckupPdf(payload);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="checkup_reporte.pdf"',
      'Content-Length': pdfBytes.length.toString(),
    });

    res.status(200).end(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({
      error: 'Error interno al generar el documento PDF',
      details: (error as Error).message,
    });
  }
};