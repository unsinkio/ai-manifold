const { useState, useEffect } = React;
// Access globals
const RadialMap = window.RadialMap;
const UserProfile = window.UserProfile;
const ToolEvaluator = window.ToolEvaluator;
const LoginScreen = window.LoginScreen;
const LocalStorage = window.ManifoldStorage; // Renamed to avoid confusion
const DB = window.ManifoldDB; // Cloud DB
const Clustering = window.ManifoldClustering;
const Auth = window.ManifoldAuth; // Auth Service
const clusters = window.ManifoldData ? window.ManifoldData.clusters : [];

window.App = function App() {
    // Auth State
    const [user, setUser] = useState(null); // Firebase User
    const [authInitialized, setAuthInitialized] = useState(false);
    const [showLogin, setShowLogin] = useState(true); // Default to showing login

    // App State
    const [view, setView] = useState('map'); // 'map', 'profile'
    const [selectedClusterId, setSelectedClusterId] = useState(null);
    const [evaluatingTool, setEvaluatingTool] = useState(null);
    const [profileName, setProfileName] = useState("Mi Perfil");
    const [clusterScores, setClusterScores] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Initial Load & Auth Check
    useEffect(() => {
        // Init Services
        Auth.init();
        DB.init();

        // Listen for auth state
        const unsubscribe = Auth.onAuthStateChanged(async (u) => {
            setUser(u);
            setAuthInitialized(true);

            if (u) {
                setShowLogin(false);
                setProfileName(u.displayName || "Usuario");

                // --- MIGRATION LOGIC START ---
                // Check if we have local data to migrate
                const localProfile = LocalStorage.getProfile();
                const localReviews = LocalStorage.getDB().reviews;
                const hasLocalData = (localProfile.sector && localProfile.sector !== "") || localReviews.length > 0;

                // Only migrate if we haven't flagged it as done (simple check: local storage key)
                const isMigrated = localStorage.getItem('manifold_migrated_to_cloud');

                if (hasLocalData && !isMigrated) {
                    console.log("Migrating local data to cloud...");
                    try {
                        await DB.migrateLocalData(u.uid, {
                            userProfile: localProfile,
                            reviews: localReviews
                        });
                        localStorage.setItem('manifold_migrated_to_cloud', 'true');
                        // Optional: Clear local DB? LocalStorage.initDB();
                        alert("¡Tus datos locales se han sincronizado con la nube!");
                    } catch (e) {
                        console.error("Migration failed", e);
                    }
                }

                // Load Cloud Data to State (Hybrid Approach for now)
                // ideally we should fetch from DB and populate Clustering engine
                // For this MVP, we might still rely on LocalStorage for "fast" reads 
                // OR we need to update clustering.js to accept data injection.
                // Let's reload profile name from Cloud to be sure.
                const cloudProfile = await DB.getUserProfile(u.uid);
                if (cloudProfile && cloudProfile.sector) {
                    setProfileName(cloudProfile.sector);
                }

                // Update Clustering Engine with Cloud Data?
                // Currently Clustering.js reads directly from LocalStorage.
                // This is a legacy debt. FIX: We'll inject cloud reviews into Clustering logic later.
                // For this step, let's assume Migration pushed data to Cloud, 
                // and we will KEEP LocalStorage as the "Client Cache" for now to avoid rewriting Clustering.js entirely in this step.
                // So: User Auth -> Sync Local -> Cloud.
                // Future read: Cloud -> Local -> UI.
                // --- MIGRATION LOGIC END ---
            }
        });

        // Load local profile data (Fallback / Cache)
        if (LocalStorage) {
            const p = LocalStorage.getProfile();
            if (p.sector) setProfileName(p.sector); // Override with local sector if available? Maybe.

            const scores = {};
            clusters.forEach(c => {
                scores[c.id] = Clustering.getClusterAffinity(c.label);
            });
            setClusterScores(scores);
        }

        return () => unsubscribe();
    }, [refreshTrigger, view]);

    // Derived Data Logic
    const selectedCluster = clusters.find(c => c.id === selectedClusterId);

    const coreDetails = {
        title: "Núcleo Central de IA",
        subtitle: "IAs que conectan múltiples industrias y flujos de trabajo.",
        description: "Estas herramientas viven en el centro del mapa...",
        geodesic: "Idea → Borrador → Investigación → Refinamiento → Reporte",
        tools: [
            { id: "notion", name: "Notion AI", description: "Cerebro operativo." },
            { id: "copilot", name: "Microsoft Copilot", description: "IA en Office 365." },
            { id: "perplexity", name: "Perplexity", description: "Investigación contextual." },
            { id: "chatgpt", name: "ChatGPT", description: "Motor de razonamiento." }
        ]
    };

    let displayTools = selectedCluster ? selectedCluster.tools : coreDetails.tools;
    if (selectedCluster) {
        displayTools = Clustering.getRecommendedTools(selectedCluster.label, displayTools);
    } else {
        displayTools = Clustering.getRecommendedTools("General", displayTools);
    }

    const displayData = selectedCluster ? {
        title: selectedCluster.label,
        subtitle: "Cluster de herramientas especializadas.",
        description: selectedCluster.description,
        geodesic: selectedCluster.geodesic,
        tools: displayTools
    } : { ...coreDetails, tools: displayTools };


    // Handlers
    const handleEvaluate = (tool) => {
        setEvaluatingTool(tool);
    };

    const handleSaveReview = () => {
        setEvaluatingTool(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleSaveProfile = () => {
        const p = Storage.getProfile();
        setProfileName(p.sector || (user ? user.displayName : "Mi Perfil"));
        setView('map');
    };

    const handleLogout = async () => {
        await Auth.signOut();
        setShowLogin(true);
        setUser(null);
    };

    // Render Login Screen if needed
    if (showLogin && !user) {
        return (
            <LoginScreen
                onLoginSuccess={(u) => {
                    setUser(u);
                    setShowLogin(false);
                }}
                onSkip={() => setShowLogin(false)}
            />
        );
    }

    return (
        <div className="flex h-screen bg-[#0b1020] text-gray-100 font-sans overflow-hidden">

            {/* -- Navigation -- */}
            <div className="absolute top-4 right-6 z-50 flex gap-4 items-center">
                {view !== 'map' && (
                    <button
                        onClick={() => setView('map')}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm backdrop-blur-md transition-colors"
                    >
                        ← Volver al Mapa
                    </button>
                )}

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setView('profile')}
                        className="px-4 py-2 bg-[#9da2ff]/20 hover:bg-[#9da2ff]/30 text-[#9da2ff] border border-[#9da2ff]/50 rounded-full text-sm backdrop-blur-md transition-colors flex items-center gap-2"
                    >
                        {user ? (
                            <img src={user.photoURL} className="w-5 h-5 rounded-full border border-white/30" />
                        ) : (
                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        )}
                        {profileName}
                    </button>

                    {user && (
                        <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-white underline p-2">
                            Salir
                        </button>
                    )}

                    {!user && !showLogin && (
                        <button onClick={() => setShowLogin(true)} className="text-xs text-[#9da2ff] hover:text-white underline p-2">
                            Login
                        </button>
                    )}
                </div>
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
                                    clusterScores={clusterScores}
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
                                <span>Modo Exploración {user ? "" : "(Invitado)"}</span>
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
                    onClose={handleSaveReview}
                />
            )}
        </div>
    );
};
