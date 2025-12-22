const { useState } = React;
// Access globals
const RadialMap = window.RadialMap;
const clusters = window.ManifoldData ? window.ManifoldData.clusters : [];

window.App = function App() {
    const [selectedClusterId, setSelectedClusterId] = useState(null);

    const selectedCluster = clusters.find(c => c.id === selectedClusterId);

    // Core description when nothing is selected
    const coreDetails = {
        title: "Núcleo Central de IA",
        subtitle: "IAs que conectan múltiples industrias y flujos de trabajo.",
        description: "Estas herramientas viven en el centro del mapa: Notion AI, Microsoft Copilot, Perplexity, Google Gemini Workspace y ChatGPT. Funcionan como hubs cognitivos que conectan documentación, investigación, comunicación y coordinación entre clusters.",
        geodesic: "Idea → Borrador en Notion → Investigación con Perplexity → Refinamiento con ChatGPT → Presentación / Reporte vía Copilot.",
        tools: [
            { name: "Notion AI", description: "Cerebro operativo para documentación." },
            { name: "Microsoft Copilot", description: "IA integrada en Office 365." },
            { name: "Perplexity", description: "Investigación con contexto." },
            { name: "ChatGPT", description: "Motor de razonamiento." }
        ]
    };

    const displayData = selectedCluster ? {
        title: selectedCluster.label,
        subtitle: "Cluster de herramientas especializadas.",
        description: selectedCluster.description,
        geodesic: selectedCluster.geodesic,
        tools: selectedCluster.tools
    } : coreDetails;

    return (
        <div className="flex h-screen bg-[#0b1020] text-gray-100 font-sans overflow-hidden">
            {/* -- Main Canvas Area -- */}
            <div className="flex-grow relative bg-slate-900 overflow-hidden">
                {/* We can reproduce the nice radial gradient background here or in CSS */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a2440] to-[#050712] z-0 pointer-events-none" />

                <div className="relative z-10 w-full h-full">
                    {RadialMap ? (
                        <RadialMap
                            onClusterSelect={setSelectedClusterId}
                            selectedClusterId={selectedClusterId}
                        />
                    ) : <div className="p-10">Cargando Mapa...</div>}
                </div>
            </div>

            {/* -- Sidebar -- */}
            <div className="w-96 bg-[#050712] border-l border-white/10 flex flex-col p-5 overflow-y-auto shadow-2xl z-20">
                <header className="mb-6">
                    <h1 className="text-lg font-bold uppercase tracking-wider text-[#9da2ff] mb-2">Manifold de IA</h1>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#9da2ff]/10 border border-[#9da2ff]/30 rounded-full text-xs text-[#c2c6ff]">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span>Modo Exploración</span>
                    </div>
                </header>

                <div className="flex-1 flex flex-col gap-6 animate-fadeIn">
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-1">{displayData.title}</h2>
                        <p className="text-sm text-gray-400">{displayData.subtitle}</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xs uppercase tracking-wide text-[#9da2ff] mb-2">Descripción</h3>
                            <p className="text-sm leading-relaxed text-[#d4d7ff] bg-white/5 p-3 rounded-lg border border-white/5">
                                {displayData.description}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xs uppercase tracking-wide text-[#9da2ff] mb-2">Flujo Geodésico Típico</h3>
                            <div className="text-xs font-mono text-cyan-300 bg-cyan-900/20 p-2 rounded border border-cyan-500/30">
                                {displayData.geodesic}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs uppercase tracking-wide text-[#9da2ff] mb-3">Herramientas Clave</h3>
                            <ul className="space-y-2">
                                {displayData.tools.map((t, idx) => (
                                    <li key={idx} className="group flex items-start gap-3 p-2 rounded hover:bg-white/5 transition-colors cursor-default">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#9da2ff] mt-1.5 group-hover:bg-white transition-colors" />
                                        <div>
                                            <strong className="block text-sm text-[#e3e5ff]">{t.name}</strong>
                                            <span className="text-xs text-[#8e93c2]">{t.description}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 text-xs text-gray-500">
                    <p>Proyecto Manifold v0.1 • React Architecture</p>
                </div>
            </div>
        </div>
    );
};
