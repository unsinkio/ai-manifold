const { useState } = React;

window.ToolAdder = function ToolAdder({ sectorId, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [year, setYear] = useState(2024);
    const [secondarySectors, setSecondarySectors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            await onAdd({
                name,
                description,
                year,
                primaryDomain: sectorId, // Explicitly primary
                secondaryDomains: secondarySectors,
                sectorId // Legacy support if needed
            });
            onClose();
        } catch (err) {
            alert("Error al guardar la herramienta. Intenta de nuevo.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Agregar Nueva Herramienta</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                            <input
                                type="text"
                                className="w-full bg-[#1a2440] border border-white/10 rounded p-3 text-white focus:border-[#9da2ff] outline-none"
                                placeholder="Ej. Amazing AI"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Año</label>
                            <input
                                type="number"
                                min="2010"
                                max="2030"
                                className="w-full bg-[#1a2440] border border-white/10 rounded p-3 text-white focus:border-[#9da2ff] outline-none text-center"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Descripción</label>
                        <textarea
                            rows="2"
                            className="w-full bg-[#1a2440] border border-white/10 rounded p-3 text-white focus:border-[#9da2ff] outline-none"
                            placeholder="¿Qué hace esta herramienta?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Multi-Sector Selection */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Sectores Adicionales (Multidisciplinar)</label>
                        <div className="grid grid-cols-2 gap-2 text-xs bg-[#1a2440] p-3 rounded border border-white/10 max-h-32 overflow-y-auto custom-scrollbar">
                            {window.ManifoldData.domains.filter(d => d.id !== sectorId).map(domain => (
                                <label key={domain.id} className="flex items-center gap-2 cursor-pointer hover:text-white text-gray-400">
                                    <input
                                        type="checkbox"
                                        value={domain.id}
                                        checked={secondarySectors.includes(domain.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) setSecondarySectors([...secondarySectors, domain.id]);
                                            else setSecondarySectors(secondarySectors.filter(id => id !== domain.id));
                                        }}
                                        className="rounded border-white/20 bg-black/50"
                                    />
                                    <span className="truncate">{window.ManifoldI18n.translateData(domain.label)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-[#9da2ff] text-[#050712] font-bold rounded hover:bg-[#b4b8ff] transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Guardando...' : 'Agregar al Mapa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
