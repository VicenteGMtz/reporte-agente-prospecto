# Checkup Financiero - PDF Generation Service

Microservicio serverless diseñado para generar reportes financieros dinámicos y multipágina en formato **PDF (A4)** a partir de un payload JSON. Construido para ejecutarse en **Google Cloud Functions (2nd Gen)** utilizando **Puppeteer** como motor de renderizado vectorial.

---

## 🛠️ Stack Tecnológico y Versiones

| Tecnología | Versión / Especificación | Propósito |
| :--- | :--- | :--- |
| **Node.js** | `v24.15.0` (LTS / ESM) | Entorno de ejecución principal |
| **TypeScript** | `^5.x` (Strict Mode) | Tipado estático y arquitectura modular |
| **@google-cloud/functions-framework** | `^3.x` | Servidor HTTP y emulador local de Cloud Functions |
| **Puppeteer** | `^23.x` | Renderizado HTML/CSS a PDF en entorno local |
| **Puppeteer Core + @sparticuz/chromium** | `^23.x` / `^131.x` | Binario ligero de Chromium optimizado para contenedores GCP |
| **tsx** | `^4.x` | Ejecución directa de TypeScript en desarrollo sin compilación previa |

---

## 📁 Arquitectura y Estructura de Carpetas

El proyecto sigue una arquitectura **modular basada en componentes/secciones autocontenidas** y el patrón **Factory** para enrutar dinámicamente entre distintas vistas de reporte (Cliente/Prospecto, Agente, etc.).

```text
checkup-pdf-service/
├── src/
│   ├── assets/                            # Recursos estáticos compartidos
│   │   ├── images/                        # Imágenes locales (convertidas a Base64 en runtime)
│   │   └── styles/
│   │       └── global.css                 # Reset, reglas @page A4, variables y encabezados globales
│   │
│   ├── services/
│   │   └── pdf-generator.service.ts       # Motor agnóstico de Puppeteer (HTML string -> PDF Buffer)
│   │
│   ├── templates/                         # Plantillas organizadas por perfil/canal
│   │   ├── agent/                         # Vista exclusiva para intermediarios/agentes
│   │   ├── client/                        # Vista para clientes y prospectos
│   │   │   ├── sections/                  # Secciones independientes (HTML + CSS + Builder TS)
│   │   │   │   ├── cover/                 # Página 1: Portada, banner, tacómetro y datos generales
│   │   │   │   ├── recommendations/       # Bloque dinámico de recomendaciones financieras
│   │   │   │   └── protection-income/     # Gráfica radial SVG de protección y barras de ingresos
│   │   │   ├── layout.html                # Esqueleto HTML principal que ensambla las secciones
│   │   │   └── client-report.builder.ts   # Orquestador que compila CSS y HTML del reporte cliente
│   │   │
│   │   └── template.factory.ts            # Selector dinámico de plantilla según el payload
│   │
│   ├── types/
│   │   └── checkup.types.ts               # Interfaces y contratos TypeScript del payload JSON
│   │
│   ├── utils/
│   │   └── template-loader.util.ts        # Utilidad para lectura de archivos y conversión a Base64
│   │
│   └── index.ts                           # Punto de entrada HTTP (`generarPdf`) de la Cloud Function
│
├── .gitignore
├── package.json
└── tsconfig.json