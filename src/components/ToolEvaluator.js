const { useState, useEffect } = React;
const Storage = window.ManifoldStorage;

window.ToolEvaluator = function ToolEvaluator({ toolId, toolName, onClose }) {
    const [ratings, setRatings] = useState({
        accuracy: 3,
        speed: 3,
        usability: 3,
        customization: 3,
        cost: 3
    });

    const criteria = [
        { id: 'accuracy', label: 'Precisión en la tarea' },
        { id: 'speed', label: 'Velocidad de respuesta' },
        { id: 'usability', label: 'Facilidad de uso' },
        { id: 'customization', label: 'Capacidad de personalización' },
        { id: 'cost', label: 'Costo-efectividad' }
    ];

    const handleSliderChange = (id, val) => {
        setRatings(prev => ({ ...prev, [id]: parseInt(val) }));
    };

    const calculateFitScore = () => {
        const values = Object.values(ratings);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        return Math.round(avg * 20); // 0-100 scale
    };

    const handleSave = () => {
        Storage.saveReview({
            toolId,
            ratings
        });
        alert(`Evaluación guardada para ${toolName}. Fit Score: ${calculateFitScore()}%`);
        if (onClose) onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6 max-w-lg w-full shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Evaluando: <span className="text-[#9da2ff]">{toolName}</span></h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>

                <div className="space-y-4 mb-8">
                    {criteria.map(c => (
                        <div key={c.id}>
                            <div className="flex justify-between text-sm text-gray-300 mb-1">
                                <span>{c.label}</span>
                                <span className="text-[#9da2ff] font-mono">{ratings[c.id]}/5</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="1"
                                value={ratings[c.id]}
                                onChange={(e) => handleSliderChange(c.id, e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#9da2ff]"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-4">
                    <div className="text-sm text-gray-400">
                        Fit Score Estimado: <span className="text-white font-bold">{calculateFitScore()}%</span>
                    </div>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-[#9da2ff] text-[#050712] font-bold rounded hover:bg-[#b4b8ff] transition-colors"
                    >
                        Guardar Evaluación
                    </button>
                </div>
            </div>
        </div>
    );
};
