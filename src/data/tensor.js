window.ManifoldData = window.ManifoldData || {};

// 1. DOMAINS (Sectors) - Fixed Angular Frames
// Theta is assigned sequentially for now: 0 to 2PI
window.ManifoldData.domains = [
    { id: "education", label: { es: "Educación & LMS/SIS", en: "Education & LMS/SIS" }, color: "#5b8def" },
    { id: "productivity", label: { es: "Productividad & Knowledge Work", en: "Productivity & Knowledge Work" }, color: "#8f5bff" },
    { id: "sales", label: { es: "Ventas, Marketing & Real Estate", en: "Sales, Marketing & Real Estate" }, color: "#ff7f50" },
    { id: "finance", label: { es: "Finanzas, Contabilidad & Auditoría", en: "Finance, Accounting & Audit" }, color: "#ffc857" },
    { id: "health", label: { es: "Salud, Clínicas & Bienestar", en: "Health, Clinics & Wellness" }, color: "#5bd1b2" },
    { id: "research", label: { es: "Investigación & Ciencia", en: "Research & Science" }, color: "#c77dff" },
    { id: "engineering", label: { es: "Ingeniería, DevOps & Desarrollo", en: "Engineering, DevOps & Dev" }, color: "#ff6b9c" },
    { id: "creative", label: { es: "Diseño, Medios & Contenido", en: "Design, Media & Content" }, color: "#4fb3ff" }
];

// 2. TOOLS (Entities) - Independent of Domains
window.ManifoldData.tools = [
    // Education
    { id: "notion", name: "Notion AI", year: 2023, description: { es: "Syllabus, documentación y plantillas de curso.", en: "Syllabus, documentation and course templates." } },
    { id: "cengage", name: "Cengage MindTap AI", year: 2022, description: { es: "Alineación de actividades con competencias.", en: "Activity alignment with skills." } },
    { id: "eduaide", name: "Eduaide / Class Companion", year: 2023, description: { es: "Generación de actividades dentro del LMS.", en: "Activity generation within LMS." } },
    { id: "gradescope", name: "Gradescope AI", year: 2018, description: { es: "Calificación asistida y feedback masivo.", en: "Assisted grading and mass feedback." } },
    { id: "ms_learning", name: "Microsoft Learning Accelerators", year: 2022, description: { es: "Apoyo en tiempo real a estudiantes.", en: "Real-time student support." } },

    // Productivity
    { id: "copilot", name: "Microsoft Copilot", year: 2023, description: { es: "IA en Outlook, Word, Excel, PowerPoint y Teams.", en: "AI in Outlook, Word, Excel, PowerPoint and Teams." } },
    { id: "gemini", name: "Google Gemini Workspace", year: 2023, description: { es: "IA en Docs, Sheets, Gmail y Meet.", en: "AI in Docs, Sheets, Gmail and Meet." } },
    { id: "asana", name: "Asana Intelligence", year: 2023, description: { es: "Estructura proyectos y detecta bloqueos.", en: "Structures projects and detects blockers." } },
    { id: "monday", name: "Monday AI", year: 2023, description: { es: "Automation y asistencia en tableros de trabajo.", en: "Automation and assistance in work boards." } },
    { id: "perplexity", name: "Perplexity Enterprise", year: 2022, description: { es: "Investigación aplicada a informes.", en: "Applied research for reports." } },
    {
        id: "notion_prod",
        name: "Notion AI (Prod)",
        originalId: "notion",
        year: 2023,
        description: { es: "Repositorio vivo de procesos y decisiones.", en: "Living repository of processes and decisions." },
        // GEODESIC HISTORY (The Trail)
        // Represents previous state: Pure Productivity, Lower Entropy (More Specialized)
        history: [
            { domainId: "productivity", weight: 1.0, year: 2020 } // Was purely productivity
        ]
    },

    // Sales
    {
        id: "gohighlevel", name: "GoHighLevel AI", year: 2023, description: { es: "Flujos de nurturing y respuestas instantáneas.", en: "Nurturing flows and instant replies." },
        history: [
            { domainId: "sales", weight: 0.5, year: 2021 } // Started weaker
        ]
    },
    { id: "hubspot", name: "HubSpot AI Assist", year: 2023, description: { es: "Emails, secuencias y resumen de deals.", en: "Emails, sequences and deal summaries." } },
    { id: "zoho", name: "Zoho Zia", year: 2023, description: { es: "Análisis y predicciones dentro del CRM.", en: "Analysis and predictions within CRM." } },
    { id: "rechat", name: "ReChat / LocalizeOS", year: 2022, description: { es: "IA para agentes inmobiliarios (listings, comps).", en: "AI for agents (listings, comps)." } },
    { id: "fathom", name: "Fathom AI", year: 2021, description: { es: "Convierte llamadas en tareas concretas.", en: "Converts calls into concrete tasks." } },

    // Finance
    { id: "excel_copilot", name: "Excel Copilot", year: 2023, description: { es: "Análisis, fórmulas y reporting asistido.", en: "Analysis, formulas and assisted reporting." } },
    { id: "powerbi", name: "Power BI Copilot", year: 2023, description: { es: "Ayuda con DAX y narrativas de datos.", en: "Help with DAX and data narratives." } },
    { id: "quickbooks", name: "QuickBooks AI", year: 2023, description: { es: "Clasificación y reconciliación de movimientos.", en: "Transaction classification and reconciliation." } },
    { id: "ramp", name: "Ramp IQ / Brex AI", year: 2022, description: { es: "Detección de gastos anómalos.", en: "Anomalous expense detection." } },
    { id: "glean", name: "Glean AI", year: 2022, description: { es: "Optimización de cuentas por pagar/cobrar.", en: "AP/AR optimization." } },
    { id: "plaid", name: "Plaid Signal AI", year: 2021, description: { es: "Evaluación de riesgo de pago.", en: "Payment risk evaluation." } },

    // Health
    { id: "welltory", name: "Welltory", year: 2019, description: { es: "Interpretación de HRV, estrés y energía.", en: "HRV, stress and energy interpretation." } },
    { id: "apple_watch", name: "Integración Apple Watch", year: 2018, description: { es: "Captura de datos biométricos.", en: "Biometric data capture." } },
    { id: "nabla", name: "Nabla / DeepScribe / Augmedix", year: 2023, description: { es: "Notas clínicas desde voz.", en: "Clinical notes from voice." } },
    { id: "overjet", name: "Overjet", year: 2021, description: { es: "Análisis de radiografías dentales.", en: "Dental X-ray analysis." } },
    { id: "hippocratic", name: "Hippocratic AI", year: 2023, description: { es: "Monitoreo y banderas rojas clínicas.", en: "Monitoring and clinical red flags." } },

    // Research
    { id: "perplexity_res", name: "Perplexity Pro", year: 2022, description: { es: "Preguntas complejas con citas confiables.", en: "Complex questions with reliable citations." } },
    { id: "elicit", name: "Elicit", year: 2022, description: { es: "Revisiones sistemáticas y extracción de datos.", en: "Systematic reviews and data extraction." } },
    { id: "wolfram", name: "Wolfram + LLM", year: 2023, description: { es: "Cómputo simbólico y numérico avanzado.", en: "Symbolic and advanced numerical compute." } },
    { id: "scite", name: "Scite AI", year: 2021, description: { es: "Contexto de citas: apoyo o contradicción.", en: "Citation context: supporting or contrasting." } },

    // Engineering
    { id: "github_copilot", name: "GitHub Copilot Enterprise", year: 2023, description: { es: "Asistencia en el IDE y PRs.", en: "IDE and PR assistance." } },
    { id: "jetbrains", name: "JetBrains AI Assistant", year: 2023, description: { es: "Ayuda en entornos JetBrains.", en: "Help within JetBrains environments." } },
    { id: "awsq", name: "AWS Q", year: 2023, description: { es: "Consultoría de infra y scripts en AWS.", en: "Infra consultancy and AWS scripts." } },
    { id: "gcp_gemini", name: "GCP Gemini for Cloud", year: 2023, description: { es: "Asistencia en GCP.", en: "Assistance in GCP." } },
    { id: "datadog", name: "Datadog Bits AI", year: 2023, description: { es: "Análisis de logs y anomalías.", en: "Log and anomaly analysis." } },
    { id: "figma_dev", name: "Figma DevMode + IA", year: 2023, description: { es: "De diseño a especificación técnica.", en: "From design to specs." } },

    // Creative
    { id: "figma_ai", name: "Figma AI", year: 2024, description: { es: "Wireframes, variaciones y diseño asistido.", en: "Wireframes, variations and assisted design." } },
    { id: "firefly", name: "Adobe Firefly / GenStudio", year: 2023, description: { es: "Imagen y video generativo.", en: "Generative image and video." } },
    { id: "runway", name: "Runway ML", year: 2023, description: { es: "Video generativo y efectos avanzados.", en: "Generative video and advanced effects." } },
    { id: "descript", name: "Descript AI", year: 2020, description: { es: "Edición de audio y video basada en texto.", en: "Text-based audio and video editing." } },
    { id: "capcut", name: "CapCut IA", year: 2022, description: { es: "Edición rápida para redes sociales.", en: "Fast editing for social media." } },
    { id: "opusclip", name: "OpusClip", year: 2023, description: { es: "Clips cortos desde videos largos.", en: "Short clips from long videos." } }
];

// 3. TENSOR (The Relational Link)
// Maps Tool -> Domain with a Weight
window.ManifoldData.tensor = [
    // Education
    { toolId: "notion", domainId: "education", weight: 0.8 },
    { toolId: "cengage", domainId: "education", weight: 1.0 },
    { toolId: "eduaide", domainId: "education", weight: 1.0 },
    { toolId: "gradescope", domainId: "education", weight: 1.0 },
    { toolId: "ms_learning", domainId: "education", weight: 1.0 },
    { toolId: "notion", domainId: "productivity", weight: 0.9 }, // Notion is also Productivity

    // Productivity
    { toolId: "copilot", domainId: "productivity", weight: 1.0 },
    { toolId: "gemini", domainId: "productivity", weight: 1.0 },
    { toolId: "asana", domainId: "productivity", weight: 1.0 },
    { toolId: "monday", domainId: "productivity", weight: 1.0 },
    { toolId: "asana", domainId: "productivity", weight: 1.0 },
    { toolId: "monday", domainId: "productivity", weight: 1.0 },
    { toolId: "perplexity", domainId: "productivity", weight: 0.7 },
    // Notion (Prod) - High Generality (Spans multiple or has history)
    { toolId: "notion_prod", domainId: "productivity", weight: 0.8 },
    { toolId: "notion_prod", domainId: "education", weight: 0.5 }, // Example of spanning
    { toolId: "notion_prod", domainId: "engineering", weight: 0.3 }, // Example of spanning

    // Sales
    { toolId: "gohighlevel", domainId: "sales", weight: 1.0 },
    { toolId: "hubspot", domainId: "sales", weight: 1.0 },
    { toolId: "zoho", domainId: "sales", weight: 1.0 },
    { toolId: "rechat", domainId: "sales", weight: 1.0 },
    { toolId: "fathom", domainId: "sales", weight: 1.0 },

    // Finance
    { toolId: "excel_copilot", domainId: "finance", weight: 1.0 },
    { toolId: "powerbi", domainId: "finance", weight: 1.0 },
    { toolId: "quickbooks", domainId: "finance", weight: 1.0 },
    { toolId: "ramp", domainId: "finance", weight: 1.0 },
    { toolId: "glean", domainId: "finance", weight: 1.0 },
    { toolId: "plaid", domainId: "finance", weight: 1.0 },

    // Health
    { toolId: "welltory", domainId: "health", weight: 1.0 },
    { toolId: "apple_watch", domainId: "health", weight: 1.0 },
    { toolId: "nabla", domainId: "health", weight: 1.0 },
    { toolId: "overjet", domainId: "health", weight: 1.0 },
    { toolId: "hippocratic", domainId: "health", weight: 1.0 },

    // Research
    { toolId: "perplexity_res", domainId: "research", weight: 1.0 }, // Perplexity Pro specialized
    { toolId: "elicit", domainId: "research", weight: 1.0 },
    { toolId: "wolfram", domainId: "research", weight: 1.0 },
    { toolId: "scite", domainId: "research", weight: 1.0 },

    // Engineering
    { toolId: "github_copilot", domainId: "engineering", weight: 1.0 },
    { toolId: "jetbrains", domainId: "engineering", weight: 1.0 },
    { toolId: "awsq", domainId: "engineering", weight: 1.0 },
    { toolId: "gcp_gemini", domainId: "engineering", weight: 1.0 },
    { toolId: "datadog", domainId: "engineering", weight: 1.0 },
    { toolId: "figma_dev", domainId: "engineering", weight: 1.0 },

    // Creative
    { toolId: "figma_ai", domainId: "creative", weight: 1.0 },
    { toolId: "firefly", domainId: "creative", weight: 1.0 },
    { toolId: "runway", domainId: "creative", weight: 1.0 },
    { toolId: "descript", domainId: "creative", weight: 1.0 },
    { toolId: "capcut", domainId: "creative", weight: 1.0 },
    { toolId: "opusclip", domainId: "creative", weight: 1.0 },
];
