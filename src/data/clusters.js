window.ManifoldData = window.ManifoldData || {};
window.ManifoldData.clusters = [
    {
        id: "education",
        label: { es: "Educación & LMS/SIS", en: "Education & LMS/SIS" },
        color: "#5b8def",
        description: {
            es: "Herramientas de IA que se integran a universidades, LMS, SIS y entornos de aprendizaje.",
            en: "AI tools integrated into universities, LMS, SIS and learning environments."
        },
        geodesic: {
            es: "Contenido → Competencias → Actividades → Evaluación → Mejora continua.",
            en: "Content → Skills → Activities → Assessment → Continuous Improvement."
        },
        tools: [
            { id: "notion", name: "Notion AI", year: 2023, description: { es: "Syllabus, documentación y plantillas de curso.", en: "Syllabus, documentation and course templates." } },
            { name: "Cengage MindTap AI", year: 2022, description: { es: "Alineación de actividades con competencias.", en: "Activity alignment with skills." } },
            { name: "Eduaide / Class Companion", year: 2023, description: { es: "Generación de actividades dentro del LMS.", en: "Activity generation within LMS." } },
            { name: "Gradescope AI", year: 2018, description: { es: "Calificación asistida y feedback masivo.", en: "Assisted grading and mass feedback." } },
            { name: "Microsoft Learning Accelerators", year: 2022, description: { es: "Apoyo en tiempo real a estudiantes.", en: "Real-time student support." } }
        ]
    },
    {
        id: "productivity",
        label: { es: "Productividad & Knowledge Work", en: "Productivity & Knowledge Work" },
        color: "#8f5bff",
        description: {
            es: "IAs que viven en suites de oficina, gestores de tareas y herramientas de conocimiento.",
            en: "AI in office suites, task managers and knowledge tools."
        },
        geodesic: {
            es: "Notas → Acciones → Reuniones → Documentos → Decisiones.",
            en: "Notes → Actions → Meetings → Documents → Decisions."
        },
        tools: [
            { id: "copilot", name: "Microsoft Copilot", year: 2023, description: { es: "IA en Outlook, Word, Excel, PowerPoint y Teams.", en: "AI in Outlook, Word, Excel, PowerPoint and Teams." } },
            { id: "gemini", name: "Google Gemini Workspace", year: 2023, description: { es: "IA en Docs, Sheets, Gmail y Meet.", en: "AI in Docs, Sheets, Gmail and Meet." } },
            { name: "Asana Intelligence", year: 2023, description: { es: "Estructura proyectos y detecta bloqueos.", en: "Structures projects and detects blockers." } },
            { name: "Monday AI", year: 2023, description: { es: "Automation y asistencia en tableros de trabajo.", en: "Automation and assistance in work boards." } },
            { id: "perplexity", name: "Perplexity Enterprise", year: 2022, description: { es: "Investigación aplicada a informes.", en: "Applied research for reports." } },
            { id: "notion", name: "Notion AI", year: 2023, description: { es: "Repositorio vivo de procesos y decisiones.", en: "Living repository of processes and decisions." } }
        ]
    },
    {
        id: "sales",
        label: { es: "Ventas, Marketing & Real Estate", en: "Sales, Marketing & Real Estate" },
        color: "#ff7f50",
        description: {
            es: "IAs insertadas en CRMs, embudos de marketing y herramientas específicas para Real Estate.",
            en: "AI embedded in CRMs, marketing funnels and Real Estate tools."
        },
        geodesic: {
            es: "Lead → Clasificación → Nurture → Cita → Cierre.",
            en: "Lead → Qualification → Nurture → Appointment → Closing."
        },
        tools: [
            { name: "GoHighLevel AI", year: 2023, description: { es: "Flujos de nurturing y respuestas instantáneas.", en: "Nurturing flows and instant replies." } },
            { name: "HubSpot AI Assist", year: 2023, description: { es: "Emails, secuencias y resumen de deals.", en: "Emails, sequences and deal summaries." } },
            { name: "Zoho Zia", year: 2023, description: { es: "Análisis y predicciones dentro del CRM.", en: "Analysis and predictions within CRM." } },
            { name: "ReChat / LocalizeOS", year: 2022, description: { es: "IA para agentes inmobiliarios (listings, comps).", en: "AI for agents (listings, comps)." } },
            { name: "Fathom AI", year: 2021, description: { es: "Convierte llamadas en tareas concretas.", en: "Converts calls into concrete tasks." } }
        ]
    },
    {
        id: "finance",
        label: { es: "Finanzas, Contabilidad & Auditoría", en: "Finance, Accounting & Audit" },
        color: "#ffc857",
        description: {
            es: "IAs que se integran en hojas de cálculo, ERPs, contabilidad y tesorería.",
            en: "AI integrated into spreadsheets, ERPs, accounting and treasury."
        },
        geodesic: {
            es: "Transacción → Clasificación → Insight → Reconciliación → Decisión.",
            en: "Transaction → Calssification → Insight → Reconciliation → Decision."
        },
        tools: [
            { name: "Excel Copilot", year: 2023, description: { es: "Análisis, fórmulas y reporting asistido.", en: "Analysis, formulas and assisted reporting." } },
            { name: "Power BI Copilot", year: 2023, description: { es: "Ayuda con DAX y narrativas de datos.", en: "Help with DAX and data narratives." } },
            { name: "QuickBooks AI", year: 2023, description: { es: "Clasificación y reconciliación de movimientos.", en: "Transaction classification and reconciliation." } },
            { name: "Ramp IQ / Brex AI", year: 2022, description: { es: "Detección de gastos anómalos.", en: "Anomalous expense detection." } },
            { name: "Glean AI", year: 2022, description: { es: "Optimización de cuentas por pagar/cobrar.", en: "AP/AR optimization." } },
            { name: "Plaid Signal AI", year: 2021, description: { es: "Evaluación de riesgo de pago.", en: "Payment risk evaluation." } }
        ]
    },
    {
        id: "health",
        label: { es: "Salud, Clínicas & Bienestar", en: "Health, Clinics & Wellness" },
        color: "#5bd1b2",
        description: {
            es: "IAs que operan sobre datos fisiológicos, historia clínica y flujos clínicos.",
            en: "AI operating on physiological data, medical history and clinical flows."
        },
        geodesic: {
            es: "Dato fisiológico → Estado → Alerta → Intervención.",
            en: "Physiological Data → State → Alert → Intervention."
        },
        tools: [
            { name: "Welltory", year: 2019, description: { es: "Interpretación de HRV, estrés y energía.", en: "HRV, stress and energy interpretation." } },
            { name: "Integración Apple Watch", year: 2018, description: { es: "Captura de datos biométricos.", en: "Biometric data capture." } },
            { name: "Nabla / DeepScribe / Augmedix", year: 2023, description: { es: "Notas clínicas desde voz.", en: "Clinical notes from voice." } },
            { name: "Overjet", year: 2021, description: { es: "Análisis de radiografías dentales.", en: "Dental X-ray analysis." } },
            { name: "Hippocratic AI", year: 2023, description: { es: "Monitoreo y banderas rojas clínicas.", en: "Monitoring and clinical red flags." } }
        ]
    },
    {
        id: "research",
        label: { es: "Investigación & Ciencia", en: "Research & Science" },
        color: "#c77dff",
        description: {
            es: "IAs que aceleran revisión de literatura, modelado, experimentación y síntesis científica.",
            en: "AI accelerating literature review, modeling, experimentation and scientific synthesis."
        },
        geodesic: {
            es: "Pregunta → Papers → Extracción de variables → Síntesis → Modelo.",
            en: "Question → Papers → Variable extraction → Synthesis → Model."
        },
        tools: [
            { id: "perplexity", name: "Perplexity Pro", year: 2022, description: { es: "Preguntas complejas con citas confiables.", en: "Complex questions with reliable citations." } },
            { name: "Elicit", year: 2022, description: { es: "Revisiones sistemáticas y extracción de datos.", en: "Systematic reviews and data extraction." } },
            { name: "Wolfram + LLM", year: 2023, description: { es: "Cómputo simbólico y numérico avanzado.", en: "Symbolic and advanced numerical compute." } },
            { name: "Scite AI", year: 2021, description: { es: "Contexto de citas: apoyo o contradicción.", en: "Citation context: supporting or contrasting." } }
        ]
    },
    {
        id: "engineering",
        label: { es: "Ingeniería, DevOps & Desarrollo", en: "Engineering, DevOps & Dev" },
        color: "#ff6b9c",
        description: {
            es: "IAs integradas en IDEs, plataformas cloud y herramientas de observabilidad.",
            en: "AI integrated into IDEs, cloud platforms and observability tools."
        },
        geodesic: {
            es: "Error → Diagnóstico → Fix → Deploy → Monitorización.",
            en: "Error → Diagnosis → Fix → Deploy → Monitoring."
        },
        tools: [
            { name: "GitHub Copilot Enterprise", year: 2023, description: { es: "Asistencia en el IDE y PRs.", en: "IDE and PR assistance." } },
            { name: "JetBrains AI Assistant", year: 2023, description: { es: "Ayuda en entornos JetBrains.", en: "Help within JetBrains environments." } },
            { name: "AWS Q", year: 2023, description: { es: "Consultoría de infra y scripts en AWS.", en: "Infra consultancy and AWS scripts." } },
            { name: "GCP Gemini for Cloud", year: 2023, description: { es: "Asistencia en GCP.", en: "Assistance in GCP." } },
            { name: "Datadog Bits AI", year: 2023, description: { es: "Análisis de logs y anomalías.", en: "Log and anomaly analysis." } },
            { name: "Figma DevMode + IA", year: 2023, description: { es: "De diseño a especificación técnica.", en: "From design to specs." } }
        ]
    },
    {
        id: "creative",
        label: { es: "Diseño, Medios & Contenido", en: "Design, Media & Content" },
        color: "#4fb3ff",
        description: {
            es: "IAs insertadas en herramientas de diseño, edición y producción de contenido.",
            en: "AI embedded in design, editing and content production tools."
        },
        geodesic: {
            es: "Idea → Prototipo → Producción → Publicación.",
            en: "Idea → Prototype → Production → Publish."
        },
        tools: [
            { name: "Figma AI", year: 2024, description: { es: "Wireframes, variaciones y diseño asistido.", en: "Wireframes, variations and assisted design." } },
            { name: "Adobe Firefly / GenStudio", year: 2023, description: { es: "Imagen y video generativo.", en: "Generative image and video." } },
            { name: "Runway ML", year: 2023, description: { es: "Video generativo y efectos avanzados.", en: "Generative video and advanced effects." } },
            { name: "Descript AI", year: 2020, description: { es: "Edición de audio y video basada en texto.", en: "Text-based audio and video editing." } },
            { name: "CapCut IA", year: 2022, description: { es: "Edición rápida para redes sociales.", en: "Fast editing for social media." } },
            { name: "OpusClip", year: 2023, description: { es: "Clips cortos desde videos largos.", en: "Short clips from long videos." } }
        ]
    }
];
