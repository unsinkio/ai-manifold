const { useEffect, useState } = React;

window.Toast = function Toast({ message, type = 'info', duration = 3000, onClose }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(onClose, 300); // Wait for fade out animation
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!message && !visible) return null;

    const bgColors = {
        info: 'bg-[#1a2440] border-[#9da2ff]/50 text-white',
        success: 'bg-[#0f291e] border-[#4ade80]/50 text-white',
        error: 'bg-[#2a1215] border-[#f87171]/50 text-white'
    };

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl border backdrop-blur-md transition-all duration-300 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${bgColors[type] || bgColors.info}`}
        >
            <div className="flex items-center gap-3">
                {type === 'success' && <span className="text-green-400">✓</span>}
                {type === 'error' && <span className="text-red-400">⚠</span>}
                <p className="text-sm font-medium">{message}</p>
            </div>
        </div>
    );
};
