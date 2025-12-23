const { useState, useEffect } = React;
// Access globals
const RadialMap = window.RadialMap;
const UserProfile = window.UserProfile;
const ToolEvaluator = window.ToolEvaluator;
const ToolAdder = window.ToolAdder;
const LoginScreen = window.LoginScreen;
const LocalStorage = window.ManifoldStorage; // Renamed to avoid confusion
const DB = window.ManifoldDB; // Cloud DB
const Clustering = window.ManifoldClustering;
const Auth = window.ManifoldAuth; // Auth Service
const clustersMock = window.ManifoldData ? window.ManifoldData.clusters : [];

window.App = function App() {
    // Auth State
    const [user, setUser] = useState(null);
    const [authInitialized, setAuthInitialized] = useState(false);
    const [showLogin, setShowLogin] = useState(true);

    // App State
    // Initialize with LOCAL data for instant load (Offline First)
    const [clusters, setClusters] = useState(clustersMock);
    const [view, setView] = useState('map');
    const [selectedClusterId, setSelectedClusterId] = useState(null);
    const [evaluatingTool, setEvaluatingTool] = useState(null);
    const [addingTool, setAddingTool] = useState(false); // New state for ToolAdder
    const [customTools, setCustomTools] = useState([]); // Store user's custom tools
    const [profileName, setProfileName] = useState("Mi Perfil");
    const [clusterScores, setClusterScores] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [coreTools, setCoreTools] = useState([]); // Dynamic Core Nodes
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [lang, setLang] = useState(window.ManifoldI18n ? window.ManifoldI18n.currentLang : 'es');
    const [searchTerm, setSearchTerm] = useState("");

    // Access i18n helper
    const t = (k) => window.ManifoldI18n ? window.ManifoldI18n.t(k) : k;
    const td = (o) => window.ManifoldI18n ? window.ManifoldI18n.translateData(o) : o;

    // Toast & Lang Event Listener
    useEffect(() => {
        const handleToast = (e) => {
            setToast({ message: e.detail.message, type: e.detail.type || 'info' });
        };
        const handleLangChange = (e) => {
            setLang(e.detail);
        };
        window.addEventListener('manifold-toast', handleToast);
        window.addEventListener('manifold-lang-change', handleLangChange);
        return () => {
            window.removeEventListener('manifold-toast', handleToast);
            window.removeEventListener('manifold-lang-change', handleLangChange);
        };
    }, []);

    // Helper to trigger toast
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    // Initial Load & Auth Check
    // Initial Load & Auth Check (Run ONCE)
    useEffect(() => {
        // Init Services
        Auth.init();
        DB.init();

        // Hybrid Load: Real-time Ontology Subscription
        const unsubscribeOntology = DB.subscribeToOntology(cloudData => {
            if (cloudData && cloudData.length > 0) {
                console.log("Updated ontology from cloud/stream");
                setClusters(cloudData);
            }
        });

        // Listen for auth state
        const unsubscribeAuth = Auth.onAuthStateChanged(async (u) => {
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
                        window.dispatchEvent(new CustomEvent('manifold-toast', {
                            detail: { message: "¡Tus datos locales se han sincronizado con la nube!", type: 'success' }
                        }));
                    } catch (e) {
                        console.error("Migration failed", e);
                    }
                }

                // Load Cloud Data to State (Hybrid Approach for now)
                const cloudProfile = await DB.getUserProfile(u.uid);
                if (cloudProfile && cloudProfile.sector) {
                    setProfileName(cloudProfile.sector);
                    // Also sync profile to local for consistency
                    LocalStorage.saveProfile(cloudProfile);
                }

                // FETCH CUSTOM TOOLS
                try {
                    // Sync Reviews First
                    const cloudReviews = await DB.getUserReviews(u.uid);
                    if (cloudReviews && cloudReviews.length > 0) {
                        LocalStorage.syncReviews(cloudReviews);
                        setRefreshTrigger(prev => prev + 1);
                    }

                    const myTools = await DB.getCustomTools(u.uid);
                    setCustomTools(myTools);
                } catch (e) {
                    console.error("Failed to load user data", e);
                }
            } else {
                // LOGOUT / NO SESSION
                setShowLogin(true);
                setProfileName("Usuario");
                setCustomTools([]);
                setCoreTools([]);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeOntology) unsubscribeOntology();
        };
    }, []); // Empty dependency array -> Run ONCE

    // Reactive Updates (Runs when data changes)
    useEffect(() => {
        // Load local profile data (Fallback / Cache)
        if (LocalStorage) {
            const p = LocalStorage.getProfile();
            // Update profile display name from local cache (Responsive to "Save")
            if (p.sector) {
                setProfileName(p.sector);
            } else if (user) {
                setProfileName(user.displayName || "Usuario");
            }

            const scores = {};
            clusters.forEach(c => {
                scores[c.id] = Clustering.getClusterAffinity(c.label);
            });
            setClusterScores(scores);
        }
    }, [refreshTrigger, view, clusters, user]);

    // --- CORE TOOLS LOGIC ---
    useEffect(() => {
        if (LocalStorage) {
            const db = LocalStorage.getDB();
            const reviews = db.reviews || [];

            // Sort by score desc
            const sorted = [...reviews].sort((a, b) => b.fitScore - a.fitScore);
            // Take top 5 with score >= 80%
            const topReviews = sorted.filter(r => r.fitScore >= 80).slice(0, 5);

            if (topReviews.length > 0) {
                // Resolve tool details
                const allToolsFlat = clusters.flatMap(c => c.tools).concat(customTools);

                const resolvedTools = topReviews.map(r => {
                    // Try to find tool by: 1. ID, 2. Name, 3. Legacy Slug
                    const t = allToolsFlat.find(t => {
                        if (t.id === r.toolId) return true;
                        if (t.name === r.toolId) return true;
                        const slug = t.name.toLowerCase().replace(/\s+/g, '-');
                        if (slug === r.toolId) return true;
                        return false;
                    });

                    // Use resolved tool or fallback object
                    return t ? { ...t, label: t.name, id: t.id || r.toolId } : { id: r.toolId, label: r.toolId };
                });

                // Deduplicate by ID to avoid "same key" warning
                const uniqueTools = [];
                const seenIds = new Set();

                resolvedTools.forEach(t => {
                    const id = t.id || t.label; // Fallback to label if no ID
                    if (!seenIds.has(id)) {
                        seenIds.add(id);
                        uniqueTools.push(t);
                    }
                });

                setCoreTools(uniqueTools);
            } else {
                setCoreTools([]);
            }
        }
    }, [refreshTrigger, customTools, user]); // Re-run when user interactions happen

    const handleClusterSelect = (clusterId) => {
        setSelectedClusterId(clusterId);
        setView('map'); // Ensure we stay on map view but open sidebar
    };

    const handleEvaluateTool = (tool) => {
        setEvaluatingTool(tool);
    };

    const handleSaveReview = () => {
        setEvaluatingTool(null);
        setRefreshTrigger(prev => prev + 1);
    };

    // --- Custom Tool Handlers ---
    const handleAddToolStart = () => {
        setAddingTool(true);
    };

    const handleAddToolConfirm = async (toolData) => {
        if (!user) return;
        try {
            const newTool = await DB.saveCustomTool(user.uid, toolData);
            setCustomTools(prev => [newTool, ...prev]);
        } catch (e) {
            console.error(e);
            throw e;
        }
    };


    // Login Handlers
    const handleLoginSuccess = async () => {
        // Rely on onAuthStateChanged to handle state updates
    };

    const handleGuest = () => {
        setShowLogin(false);
    };

    // Prepare Display Data
    let displayData = null;
    if (selectedClusterId) {
        const cluster = clusters.find(c => c.id === selectedClusterId);
        if (cluster) {
            // MERGE STATIC + CUSTOM TOOLS
            // Filter custom tools for this cluster
            const myClusterTools = customTools.filter(t => t.sectorId === selectedClusterId).map(t => ({
                ...t,
                isCustom: true // Flag to identify them in UI
            }));

            // Combine
            const allToolsForCluster = [...cluster.tools, ...myClusterTools];

            // Get recommendations/scores
            const recommendedTools = Clustering.getRecommendedTools(cluster.label, allToolsForCluster);

            displayData = {
                ...cluster,
                tools: recommendedTools
            };
        }
    }

    if (showLogin && !user) {
        return (<LoginScreen onLoginSuccess={handleLoginSuccess} onSkip={handleGuest} />);
    }

    return (
        <div className="flex flex-col h-screen bg-[#050712] text-white font-sans overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0f1e] z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5b8def] to-[#9da2ff] shadow-[0_0_15px_rgba(91,141,239,0.5)]"></div>
                    <span className="text-xl font-bold tracking-tight">{t("app.title")}</span>
                </div>
                <div className="flex items-center gap-6">
                    {/* Search Bar */}
                    <div className="relative group w-32 focus-within:w-64 transition-all duration-300">
                        <input
                            type="text"
                            placeholder={t("nav.search") || "Buscar..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-1 px-4 text-sm focus:outline-none focus:border-[#9da2ff] focus:bg-white/10 transition-all"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">🔍</span>
                    </div>

                    {/* Lang Toggle */}
                    <button
                        onClick={() => window.ManifoldI18n.setLanguage(lang === 'es' ? 'en' : 'es')}
                        className="text-xs font-mono bg-white/5 px-2 py-1 rounded border border-white/10 hover:bg-white/10"
                    >
                        {lang.toUpperCase()}
                    </button>

                    <nav className="flex gap-4 text-sm font-medium text-gray-400">
                        <button onClick={() => setView('map')} className={`hover:text-white transition-colors ${view === 'map' ? 'text-white' : ''}`}>{t("nav.map")}</button>
                        <button onClick={() => setView('profile')} className={`hover:text-white transition-colors ${view === 'profile' ? 'text-white' : ''}`}>
                            {user ? (
                                <span className="flex items-center gap-2">
                                    {user.photoURL && <img src={user.photoURL} className="w-6 h-6 rounded-full" />}
                                    {profileName}
                                </span>
                            ) : t("nav.profile")}
                        </button>
                    </nav>
                    {user && (
                        <button onClick={() => Auth.signOut()} className="text-xs text-red-400 hover:text-red-300">{t("nav.logout")}</button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative flex overflow-hidden">
                {view === 'profile' ? (
                    <div className="w-full h-full overflow-y-auto">
                        <UserProfile onSave={() => setRefreshTrigger(prev => prev + 1)} />
                    </div>
                ) : (
                    <>
                        {/* Map Area */}
                        <div className="flex-1 relative h-full flex items-center justify-center bg-[radial-gradient(circle_at_center,_#1a2440_0%,_#050712_100%)]">
                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #2d3b5e 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                            <RadialMap
                                onClusterSelect={handleClusterSelect}
                                selectedClusterId={selectedClusterId}
                                clusterScores={clusterScores}
                                userCoreNodes={coreTools.length > 0 ? coreTools : null}
                                lang={lang}
                                searchTerm={searchTerm}
                            />
                        </div>

                        {/* Sidebar */}
                        <div className={`w-full md:w-96 bg-[#0f172a]/95 backdrop-blur-md border-l border-white/10 p-6 flex flex-col transition-all duration-300 absolute right-0 top-0 bottom-0 shadow-2xl z-50 ${selectedClusterId ? 'translate-x-0' : 'translate-x-full'}`}>
                            {selectedClusterId && displayData && (
                                <>
                                    <button
                                        onClick={() => setSelectedClusterId(null)}
                                        className="mb-4 text-sm text-gray-400 hover:text-white flex items-center gap-2"
                                    >
                                        {t("sidebar.back")}
                                    </button>

                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold mb-2" style={{ color: displayData.color }}>{td(displayData.label)}</h2>
                                        <p className="text-sm text-gray-300 leading-relaxed mb-4">{td(displayData.description)}</p>
                                        <div className="text-xs font-mono text-gray-500 bg-black/20 p-3 rounded border border-white/5">
                                            <span className="block mb-1 text-gray-400">{t("sidebar.geodesic")}</span>
                                            {td(displayData.geodesic)}
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider sticky top-0 bg-[#0f172a] py-2 z-10">
                                            {t("sidebar.recommended")}
                                        </h3>
                                        {displayData.tools.map((tool, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => handleEvaluateTool(tool)}
                                                className="group p-4 rounded-lg bg-[#1a2440] hover:bg-[#253259] border border-white/5 hover:border-[#9da2ff]/30 transition-all cursor-pointer relative"
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-white group-hover:text-[#9da2ff] transition-colors">{tool.name}</h4>
                                                    {tool.score !== undefined && (
                                                        <span className="text-xs font-bold text-[#9da2ff] bg-[#9da2ff]/10 px-2 py-0.5 rounded">
                                                            {Math.round(tool.score)}% {t("sidebar.fit")}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400 line-clamp-2">{td(tool.description)}</p>
                                                {tool.isCustom && <span className="absolute bottom-1 right-2 text-[10px] text-gray-500">{t("sidebar.custom_badge")}</span>}
                                            </div>
                                        ))}
                                    </div>

                                    {/* ADD TOOL BUTTON */}
                                    {user && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <button
                                                onClick={handleAddToolStart}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1a2440] hover:bg-[#253259] border border-dashed border-gray-600 hover:border-[#9da2ff] text-gray-400 hover:text-white rounded-lg transition-all text-sm font-medium"
                                            >
                                                <span>+</span> {t("sidebar.add")}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </main>

            {/* -- Tool Evaluator Modal -- */}
            {evaluatingTool && (
                <ToolEvaluator
                    toolId={evaluatingTool.id || evaluatingTool.name}
                    toolName={evaluatingTool.name}
                    sectorId={selectedClusterId || evaluatingTool.sectorId} // Pass context or tool's own sector
                    onClose={handleSaveReview}
                />
            )}

            {addingTool && selectedClusterId && (
                <ToolAdder
                    sectorId={selectedClusterId}
                    onClose={() => setAddingTool(false)}
                    onAdd={handleAddToolConfirm}
                />
            )}

            {/* Global Toast */}
            {window.Toast && <window.Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: null })} />}
        </div>
    );
};
