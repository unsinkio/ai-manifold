window.ManifoldI18n = {
    currentLang: 'es', // Default language

    // UI Dictionary
    dictionary: {
        es: {
            // Header
            "app.title": "AI MANIFOLD",
            "nav.map": "Mapa",
            "nav.search": "Buscar",
            "nav.profile": "Mi Perfil",
            "nav.logout": "Salir",
            "nav.guest": "Invitado",

            // Login
            "login.title": "Manifold Cognitivo",
            "login.subtitle": "Mapea tu ecosistema de Inteligencia Artificial",
            "login.google": "Acceder con Google",
            "login.guest": "Continuar como Invitado",

            // Profile
            "profile.title": "Configura tu Perfil",
            "profile.sector": "Sector / Industria",
            "profile.role": "Rol / Descripción",
            "profile.tasks": "Tareas Típicas",
            "profile.save": "Guardar Perfil",
            "profile.p1": "Elige tu sector principal",
            "profile.p2": "Describe tu puesto (ej. Profesor, Desarrollador)",
            "profile.p2": "Describe tu puesto (ej. Profesor, Desarrollador)",
            "profile.p3": "¿Qué haces día a día? (ej. Calificar, Programar)",
            "profile.select_sector": "Selecciona tu sector...",
            "profile.other": "Otro",
            "profile.role_ph": "Soy diseñador UX y mis tareas principales son...",
            "profile.tasks_ph": "Redacción, Análisis de Datos, Coding...",
            "profile.saving": "Guardando...",

            // Sidebar
            "sidebar.back": "← Volver al Mapa",
            "sidebar.geodesic": "GEODESICA TÍPICA:",
            "sidebar.recommended": "Herramientas Recomendadas",
            "sidebar.add": "+ Agregar Herramienta a este Sector",
            "sidebar.custom_badge": "Añadida por ti",
            "sidebar.fit": "Fit",

            // Evaluator
            "eval.title": "Evaluar",
            "eval.precision": "Precisión / Calidad",
            "eval.speed": "Velocidad / Latencia",
            "eval.usability": "Facilidad de Uso",
            "eval.customization": "Personalización",
            "eval.cost": "Costo / Valor",
            "eval.save": "Guardar Evaluación",

            // Tool Adder
            "adder.title": "Agregar Nueva Herramienta",
            "adder.name": "Nombre de la Herramienta",
            "adder.desc": "Descripción",
            "adder.cancel": "Cancelar",
            "adder.confirm": "Agregar",

            // Map
            "map.core": "Núcleo de IA", // Legacy/Optional

            // Messages
            "msg.saved": "Guardado correctamente",
            "msg.migrated": "¡Tus datos locales se han sincronizado con la nube!",
            "msg.seeded": "Ontología subida a la nube correctamente."
        },
        en: {
            // Header
            "app.title": "AI MANIFOLD",
            "nav.map": "Map",
            "nav.search": "Search",
            "nav.profile": "My Profile",
            "nav.logout": "Logout",
            "nav.guest": "Guest",

            // Login
            "login.title": "Cognitive Manifold",
            "login.subtitle": "Map your Artificial Intelligence ecosystem",
            "login.google": "Sign in with Google",
            "login.guest": "Continue as Guest",

            // Profile
            "profile.title": "Configure Profile",
            "profile.sector": "Sector / Industry",
            "profile.role": "Role / Description",
            "profile.tasks": "Typical Tasks",
            "profile.save": "Save Profile",
            "profile.p1": "Choose your main sector",
            "profile.p2": "Describe your role (e.g., Professor, Developer)",
            "profile.p2": "Describe your role (e.g., Professor, Developer)",
            "profile.p3": "What do you do daily? (e.g., Grading, Coding)",
            "profile.select_sector": "Select your sector...",
            "profile.other": "Other",
            "profile.role_ph": "I am a UX Designer and my main tasks are...",
            "profile.tasks_ph": "Writing, Data Analysis, Coding...",
            "profile.saving": "Saving...",

            // Sidebar
            "sidebar.back": "← Back to Map",
            "sidebar.geodesic": "TYPICAL GEODESIC:",
            "sidebar.recommended": "Recommended Tools",
            "sidebar.add": "+ Add Tool to this Sector",
            "sidebar.custom_badge": "Added by you",
            "sidebar.fit": "Fit",

            // Evaluator
            "eval.title": "Evaluate",
            "eval.precision": "Precision / Quality",
            "eval.speed": "Speed / Latency",
            "eval.usability": "Ease of Use",
            "eval.customization": "Customization",
            "eval.cost": "Cost / Value",
            "eval.save": "Save Review",

            // Tool Adder
            "adder.title": "Add New Tool",
            "adder.name": "Tool Name",
            "adder.desc": "Description",
            "adder.cancel": "Cancel",
            "adder.confirm": "Add",

            // Map
            "map.core": "AI Core",

            // Messages
            "msg.saved": "Saved successfully",
            "msg.migrated": "Local data synced to cloud!",
            "msg.seeded": "Ontology seeded to cloud successfully."
        }
    },

    init: function () {
        // Try to detect language or load from storage
        const savedLang = localStorage.getItem('manifold_lang');
        if (savedLang) {
            this.currentLang = savedLang;
        } else {
            // Detect browser lang
            const browserLang = navigator.language || navigator.userLanguage;
            if (browserLang.startsWith('en')) {
                this.currentLang = 'en';
            }
        }
        console.log("i18n initialized:", this.currentLang);
    },

    setLanguage: function (lang) {
        if (this.dictionary[lang]) {
            this.currentLang = lang;
            localStorage.setItem('manifold_lang', lang);
            // Dispatch event to force re-render
            window.dispatchEvent(new CustomEvent('manifold-lang-change', { detail: lang }));
        }
    },

    t: function (key) {
        const dict = this.dictionary[this.currentLang] || this.dictionary['es'];
        return dict[key] || key;
    },

    // Helper for data objects that have {es: "...", en: "..."}
    translateData: function (dataObj) {
        if (!dataObj) return "";
        if (typeof dataObj === 'string') return dataObj; // Legacy fallback
        return dataObj[this.currentLang] || dataObj['es'] || "";
    }
};

// Auto-init
window.ManifoldI18n.init();
