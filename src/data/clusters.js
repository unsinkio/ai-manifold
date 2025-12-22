window.ManifoldData = window.ManifoldData || {};
window.ManifoldData.clusters = [
    {
        id: "education",
        label: "Educación & LMS/SIS",
        color: "#5b8def",
        description:
            "Herramientas de IA que se integran a universidades, LMS, SIS y entornos de aprendizaje.",
        geodesic:
            "Contenido → Competencias → Actividades → Evaluación → Mejora continua.",
        tools: [
            { name: "Notion AI", description: "Syllabus, documentación y plantillas de curso." },
            { name: "Cengage MindTap AI", description: "Alineación de actividades con competencias." },
            { name: "Eduaide / Class Companion", description: "Generación de actividades dentro del LMS." },
            { name: "Gradescope AI", description: "Calificación asistida y feedback masivo." },
            { name: "Microsoft Learning Accelerators", description: "Apoyo en tiempo real a estudiantes." }
        ]
    },
    {
        id: "productivity",
        label: "Productividad & Knowledge Work",
        color: "#8f5bff",
        description:
            "IAs que viven en suites de oficina, gestores de tareas y herramientas de conocimiento.",
        geodesic:
            "Notas → Acciones → Reuniones → Documentos → Decisiones.",
        tools: [
            { name: "Microsoft Copilot", description: "IA en Outlook, Word, Excel, PowerPoint y Teams." },
            { name: "Google Gemini Workspace", description: "IA en Docs, Sheets, Gmail y Meet." },
            { name: "Asana Intelligence", description: "Estructura proyectos y detecta bloqueos." },
            { name: "Monday AI", description: "Automation y asistencia en tableros de trabajo." },
            { name: "Perplexity Enterprise", description: "Investigación aplicada a informes." },
            { name: "Notion AI", description: "Repositorio vivo de procesos y decisiones." }
        ]
    },
    {
        id: "sales",
        label: "Ventas, Marketing & Real Estate",
        color: "#ff7f50",
        description:
            "IAs insertadas en CRMs, embudos de marketing y herramientas específicas para Real Estate.",
        geodesic:
            "Lead → Clasificación → Nurture → Cita → Cierre.",
        tools: [
            { name: "GoHighLevel AI", description: "Flujos de nurturing y respuestas instantáneas." },
            { name: "HubSpot AI Assist", description: "Emails, secuencias y resumen de deals." },
            { name: "Zoho Zia", description: "Análisis y predicciones dentro del CRM." },
            { name: "ReChat / LocalizeOS", description: "IA para agentes inmobiliarios (listings, comps)." },
            { name: "Fathom AI", description: "Convierte llamadas en tareas concretas." }
        ]
    },
    {
        id: "finance",
        label: "Finanzas, Contabilidad & Auditoría",
        color: "#ffc857",
        description:
            "IAs que se integran en hojas de cálculo, ERPs, contabilidad y tesorería.",
        geodesic:
            "Transacción → Clasificación → Insight → Reconciliación → Decisión.",
        tools: [
            { name: "Excel Copilot", description: "Análisis, fórmulas y reporting asistido." },
            { name: "Power BI Copilot", description: "Ayuda con DAX y narrativas de datos." },
            { name: "QuickBooks AI", description: "Clasificación y reconciliación de movimientos." },
            { name: "Ramp IQ / Brex AI", description: "Detección de gastos anómalos." },
            { name: "Glean AI", description: "Optimización de cuentas por pagar/cobrar." },
            { name: "Plaid Signal AI", description: "Evaluación de riesgo de pago." }
        ]
    },
    {
        id: "health",
        label: "Salud, Clínicas & Bienestar",
        color: "#5bd1b2",
        description:
            "IAs que operan sobre datos fisiológicos, historia clínica y flujos clínicos.",
        geodesic:
            "Dato fisiológico → Estado → Alerta → Intervención.",
        tools: [
            { name: "Welltory", description: "Interpretación de HRV, estrés y energía." },
            { name: "Integración Apple Watch", description: "Captura de datos biométricos." },
            { name: "Nabla / DeepScribe / Augmedix", description: "Notas clínicas desde voz." },
            { name: "Overjet", description: "Análisis de radiografías dentales." },
            { name: "Hippocratic AI", description: "Monitoreo y banderas rojas clínicas." }
        ]
    },
    {
        id: "research",
        label: "Investigación & Ciencia",
        color: "#c77dff",
        description:
            "IAs que aceleran revisión de literatura, modelado, experimentación y síntesis científica.",
        geodesic:
            "Pregunta → Papers → Extracción de variables → Síntesis → Modelo.",
        tools: [
            { name: "Perplexity Pro", description: "Preguntas complejas con citas confiables." },
            { name: "Elicit", description: "Revisiones sistemáticas y extracción de datos." },
            { name: "Wolfram + LLM", description: "Cómputo simbólico y numérico avanzado." },
            { name: "Scite AI", description: "Contexto de citas: apoyo o contradicción." }
        ]
    },
    {
        id: "engineering",
        label: "Ingeniería, DevOps & Desarrollo",
        color: "#ff6b9c",
        description:
            "IAs integradas en IDEs, plataformas cloud y herramientas de observabilidad.",
        geodesic:
            "Error → Diagnóstico → Fix → Deploy → Monitorización.",
        tools: [
            { name: "GitHub Copilot Enterprise", description: "Asistencia en el IDE y PRs." },
            { name: "JetBrains AI Assistant", description: "Ayuda en entornos JetBrains." },
            { name: "AWS Q", description: "Consultoría de infra y scripts en AWS." },
            { name: "GCP Gemini for Cloud", description: "Asistencia en GCP." },
            { name: "Datadog Bits AI", description: "Análisis de logs y anomalías." },
            { name: "Figma DevMode + IA", description: "De diseño a especificación técnica." }
        ]
    },
    {
        id: "creative",
        label: "Diseño, Medios & Contenido",
        color: "#4fb3ff",
        description:
            "IAs insertadas en herramientas de diseño, edición y producción de contenido.",
        geodesic:
            "Idea → Prototipo → Producción → Publicación.",
        tools: [
            { name: "Figma AI", description: "Wireframes, variaciones y diseño asistido." },
            { name: "Adobe Firefly / GenStudio", description: "Imagen y video generativo." },
            { name: "Runway ML", description: "Video generativo y efectos avanzados." },
            { name: "Descript AI", description: "Edición de audio y video basada en texto." },
            { name: "CapCut IA", description: "Edición rápida para redes sociales." },
            { name: "OpusClip", description: "Clips cortos desde videos largos." }
        ]
    }
];
