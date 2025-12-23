
const { useState, useEffect } = React;

window.UserProfile = function UserProfile({ onSave }) {
    const [profile, setProfile] = useState({ sector: '', jobDescription: '', tasks: '' });
    const [isSaving, setIsSaving] = useState(false);

    // Load Data
    useEffect(() => {
        const loadProfile = () => {
            const Storage = window.ManifoldStorage;
            console.log("Loading profile...", Storage);
            if (Storage && typeof Storage.getProfile === 'function') {
                try {
                    const p = Storage.getProfile() || {};
                    console.log("Profile data retrieved:", p);

                    // DATA SANITIZATION
                    let cleanSector = p.sector || '';
                    if (typeof cleanSector === 'object') {
                        cleanSector = cleanSector.es || cleanSector.en || JSON.stringify(cleanSector);
                    }

                    // Only update if we have meaningful data or to clear defaults
                    setProfile({
                        sector: String(cleanSector),
                        jobDescription: p.jobDescription || '',
                        tasks: p.tasks && Array.isArray(p.tasks) ? p.tasks.join(', ') : (p.tasks || '')
                    });
                } catch (err) {
                    console.warn("Error loading profile:", err);
                }
            }
        };

        loadProfile();
        // Retry once after 500ms in case of race condition during init
        const timer = setTimeout(loadProfile, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (field, val) => {
        setProfile(prev => ({ ...prev, [field]: val }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const tasksArray = profile.tasks.split(',').map(t => t.trim()).filter(Boolean);
        const profileData = {
            sector: profile.sector,
            jobDescription: profile.jobDescription,
            tasks: tasksArray
        };

        const Storage = window.ManifoldStorage;
        if (Storage) Storage.saveProfile(profileData);

        const user = window.ManifoldAuth && window.ManifoldAuth.user;
        if (user && window.ManifoldDB) {
            try {
                await window.ManifoldDB.saveUserProfile(user.uid, profileData);
            } catch (e) {
                console.error("Cloud save failed", e);
            }
        }

        // UI Feedback
        window.dispatchEvent(new CustomEvent('manifold-toast', {
            detail: { message: "Perfil guardado correctamente", type: 'success' }
        }));

        setIsSaving(false);
        if (onSave) onSave();
    };

    // Safe Clusters Access
    const clusters = (window.ManifoldData && window.ManifoldData.clusters) || [];

    // i18n helper
    const t = (k) => window.ManifoldI18n ? window.ManifoldI18n.t(k) : k;

    return (
        <div className="p-6 max-w-2xl mx-auto text-white animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-[#9da2ff]">{t("profile.title")}</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-2">{t("profile.sector")}</label>
                    <select
                        className="w-full bg-[#1a2440] border border-white/10 rounded p-3 text-white focus:border-[#9da2ff] outline-none"
                        value={profile.sector}
                        onChange={(e) => handleChange('sector', e.target.value)}
                    >
                        <option value="">{t("profile.select_sector")}</option>
                        {clusters.map(c => {
                            if (!c) return null;
                            // Safe Label Extraction
                            let label = "Cluster";
                            if (c.label) {
                                if (window.ManifoldI18n && typeof window.ManifoldI18n.translateData === 'function') {
                                    label = window.ManifoldI18n.translateData(c.label);
                                } else if (typeof c.label === 'object') {
                                    label = c.label.es || c.label.en || JSON.stringify(c.label);
                                } else {
                                    label = String(c.label);
                                }
                            }
                            // Ensure render-safe value
                            const safeLabel = String(label);
                            return <option key={c.id || Math.random()} value={safeLabel}>{safeLabel}</option>;
                        })}
                        <option value="Other">{t("profile.other")}</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2">{t("profile.role")}</label>
                    <textarea
                        rows="4"
                        className="w-full bg-[#1a2440] border border-white/10 rounded p-3 text-white focus:border-[#9da2ff] outline-none"
                        placeholder={t("profile.role_ph")}
                        value={profile.jobDescription}
                        onChange={(e) => handleChange('jobDescription', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2">{t("profile.tasks")} ({t("profile.tasks_ph")})</label>
                    <input
                        type="text"
                        className="w-full bg-[#1a2440] border border-white/10 rounded p-3 text-white focus:border-[#9da2ff] outline-none"
                        placeholder={t("profile.tasks_ph")}
                        value={profile.tasks}
                        onChange={(e) => handleChange('tasks', e.target.value)}
                    />
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`px-6 py-2 font-bold rounded transition-colors ${isSaving ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#9da2ff] text-[#050712] hover:bg-[#b4b8ff]'}`}
                >
                    {isSaving ? t("profile.saving") : t("profile.save")}
                </button>
            </div>
        </div>
    );
};

