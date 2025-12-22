const { useState, useEffect } = React;
// Access globals
const RadialMap = window.RadialMap;
const UserProfile = window.UserProfile;
const ToolEvaluator = window.ToolEvaluator;
const Storage = window.ManifoldStorage;
const Clustering = window.ManifoldClustering;
const clusters = window.ManifoldData ? window.ManifoldData.clusters : [];

window.App = function App() {
    const [view, setView] = useState('map'); // 'map', 'profile'
    const [selectedClusterId, setSelectedClusterId] = useState(null);
    const [evaluatingTool, setEvaluatingTool] = useState(null);
    const [profileName, setProfileName] = useState("Mi Perfil");
    const [clusterScores, setClusterScores] = useState({}); // { clusterId: 0-1 }
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Hack to force refresh after review

    useEffect(() => {
        if (Storage) {
            const p = Storage.getProfile();
            if (p.sector) setProfileName(p.sector);

            // Calculate Affinity Scores for Heatmap
            const scores = {};
            clusters.forEach(c => {
                // Using label as sector name for now to match profile
                scores[c.id] = Clustering.getClusterAffinity(c.label);
            });
            setClusterScores(scores);
        }
    }, [refreshTrigger, view]); // Re-calc when view changes or after review

    const selectedCluster = clusters.find(c => c.id === selectedClusterId);

    // Core description when nothing is selected
    const coreDetails = {
        title: "Núcleo Central de IA",
        subtitle: "IAs que conectan múltiples industrias y flujos de trabajo.",
        description: "Estas herramientas viven en el centro del mapa: Notion AI, Microsoft Copilot, Perplexity, Google Gemini Workspace y ChatGPT. Funcionan como hubs cognitivos que conectan documentación, investigación, comunicación y coordinación entre clusters.",
        geodesic: "Idea → Borrador en Notion → Investigación con Perplexity → Refinamiento con ChatGPT → Presentación / Reporte vía Copilot.",
        tools: [
            { id: "notion", name: "Notion AI", description: "Cerebro operativo para documentación." },
            { id: "copilot", name: "Microsoft Copilot", description: "IA integrada en Office 365." },
            { id: "perplexity", name: "Perplexity", description: "Investigación con contexto." },
            { id: "chatgpt", name: "ChatGPT", description: "Motor de razonamiento." }
        ]
    };

    // Prepare display data with sorted tools
    let displayTools = selectedCluster ? selectedCluster.tools : coreDetails.tools;

    // Sort logic
    if (selectedCluster) {
        // Use Clustering engine to sort tools by score
        // We pass the raw tools, the engine enhances them with 'score' and sorts
        displayTools = Clustering.getRecommendedTools(selectedCluster.label, displayTools);
    } else {
        // Also sort core tools? Maybe later. For now just enhance them.
        displayTools = Clustering.getRecommendedTools("General", displayTools);
    }

    // Build display object
    const displayData = selectedCluster ? {
        title: selectedCluster.label,
        subtitle: "Cluster de herramientas especializadas.",
        description: selectedCluster.description,
        geodesic: selectedCluster.geodesic,
        tools: displayTools // Sorted tools
    } : { ...coreDetails, tools: displayTools };


    const handleEvaluate = (tool) => {
        setEvaluatingTool(tool);
    };

    // Triggered when ToolEvaluator closes after saving
    const handleSaveReview = () => {
        setEvaluatingTool(null);
        setRefreshTrigger(prev => prev + 1); // Cause re-render to update heatmap
    };

    const handleSaveProfile = () => {
        const p = Storage.getProfile();
        setProfileName(p.sector || "Mi Perfil");
        setView('map');
    };

    return (
        <div className="flex h-screen bg-[#0b1020] text-gray-100 font-sans overflow-hidden">

            {/* -- Navigation -- */}
            <div className="absolute top-4 right-6 z-50 flex gap-4">
                {view !== 'map' && (
                    <button
                        onClick={() => setView('map')}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm backdrop-blur-md transition-colors"
                    >
                        ← Volver al Mapa
                    </button>
                )}
                <button
                    onClick={() => setView('profile')}
                    className="px-4 py-2 bg-[#9da2ff]/20 hover:bg-[#9da2ff]/30 text-[#9da2ff] border border-[#9da2ff]/50 rounded-full text-sm backdrop-blur-md transition-colors flex items-center gap-2"
                >
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    {profileName}
                </button>
            </div>

            {/* -- Main Content -- */}
            {view === 'profile' ? (
                <div className="w-full h-full overflow-y-auto pt-20">
                    <UserProfile onSave={handleSaveProfile} />
                </div>
            ) : (
                <>
                    {/* -- Map Canvas -- */}
                    <div className="flex-grow relative bg-slate-900 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a2440] to-[#050712] z-0 pointer-events-none" />
                        <div className="relative z-10 w-full h-full">
                            {RadialMap ? (
                                <RadialMap
                                    onClusterSelect={setSelectedClusterId}
                                    selectedClusterId={selectedClusterId}
                                    clusterScores={clusterScores} /* NEW PROP PASSING */
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
                                            <li key={idx} className="group flex flex-col gap-2 p-3 rounded bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 relative overflow-hidden">

                                                <div className="flex items-start gap-3 relative z-10">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#9da2ff] mt-1.5" />
                                                    <div className="flex-grow">
                                                        <div className="flex justify-between items-start">
                                                            <strong className="block text-sm text-[#e3e5ff]">{t.name}</strong>
                                                            {/* Show Fit Badge if score > 0 */}
                                                            {t.score > 0 && (
                                                                <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded border border-green-500/30 font-mono">
                                                                    {t.score}% Fit
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-[#8e93c2]">{t.description}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleEvaluate(t)}
                                                    className="self-end text-xs bg-[#9da2ff]/20 text-[#9da2ff] px-2 py-1 rounded hover:bg-[#9da2ff] hover:text-white transition-colors"
                                                >
                                                    Evaluar Fit
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* -- Tool Evaluator Modal -- */}
            {evaluatingTool && (
                <ToolEvaluator
                    toolId={evaluatingTool.id}
                    toolName={evaluatingTool.name}
                    onClose={handleSaveReview} /* IMPORTANT: Callback to trigger refresh */
                />
            )}
        </div>
    );
};
