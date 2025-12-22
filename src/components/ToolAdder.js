const { useState } = React;

window.ToolAdder = function ToolAdder({ sectorId, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            await onAdd({
                name,
                description,
                sectorId
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
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Nombre de la IA</label>
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
                        <label className="block text-sm text-gray-400 mb-1">Breve Descripción</label>
                        <textarea
                            rows="3"
                            className="w-full bg-[#1a2440] border border-white/10 rounded p-3 text-white focus:border-[#9da2ff] outline-none"
                            placeholder="¿Qué hace esta herramienta?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
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
