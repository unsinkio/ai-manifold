const { useState, useEffect } = React;
const Storage = window.ManifoldStorage;

window.UserProfile = function UserProfile({ onSave }) {
    const [profile, setProfile] = useState({ sector: '', jobDescription: '', tasks: '' });

    useEffect(() => {
        if (Storage) {
            const p = Storage.getProfile();
            setProfile({
                sector: p.sector || '',
                jobDescription: p.jobDescription || '',
                tasks: p.tasks ? p.tasks.join(', ') : ''
            });
        }
    }, []);

    const handleChange = (field, val) => {
        setProfile(prev => ({ ...prev, [field]: val }));
    };

    const handleSave = async () => {
        const tasksArray = profile.tasks.split(',').map(t => t.trim()).filter(Boolean);
        const profileData = {
            sector: profile.sector,
            jobDescription: profile.jobDescription,
            tasks: tasksArray
        };

        // 1. Save Local (Always copy to local cache)
        Storage.saveProfile(profileData);

        // 2. Save Cloud (If logged in)
        const user = window.ManifoldAuth && window.ManifoldAuth.user;
        if (user && window.ManifoldDB) {
            try {
                await window.ManifoldDB.saveUserProfile(user.uid, profileData);
                console.log("Profile updated in cloud");
            } catch (e) {
                console.error("Cloud save failed", e);
            }
        }

        if (onSave) onSave();
    };

    return (
        <div className="p-6 max-w-2xl mx-auto text-white animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-[#9da2ff]">Mi Perfil Profesional</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Sector / Industria</label>
                    <select
                        className="w-full bg-[#1a2440] border border-white/10 rounded p-3 text-white focus:border-[#9da2ff] outline-none"
                        value={profile.sector}
                        onChange={(e) => handleChange('sector', e.target.value)}
                    >
                        <option value="">Selecciona tu sector...</option>
                        {window.ManifoldData.clusters.map(c => (
                            <option key={c.id} value={c.label}>{c.label}</option>
                        ))}
                        <option value="Other">Otro</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2">Descripción de Rol (Job Description)</label>
                    <textarea
                        rows="4"
                        className="w-full bg-[#1a2440] border border-white/10 rounded p-3 text-white focus:border-[#9da2ff] outline-none"
                        placeholder="Soy diseñador UX y mis tareas principales son..."
                        value={profile.jobDescription}
                        onChange={(e) => handleChange('jobDescription', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2">Tareas Típicas (separadas por coma)</label>
                    <input
                        type="text"
                        className="w-full bg-[#1a2440] border border-white/10 rounded p-3 text-white focus:border-[#9da2ff] outline-none"
                        placeholder="Redacción, Análisis de Datos, Coding..."
                        value={profile.tasks}
                        onChange={(e) => handleChange('tasks', e.target.value)}
                    />
                </div>

                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#9da2ff] text-[#050712] font-bold rounded hover:bg-[#b4b8ff] transition-colors"
                >
                    Guardar Perfil
                </button>
            </div>
        </div>
    );
};
