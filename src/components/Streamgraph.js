const { useMemo } = React;

// Streamgraph Component
// Visualizes the evolution of a sector's tools over time.
// X-Axis: Time (2018-2025)
// Y-Axis: Aggregated Importance (Stack)

const Streamgraph = ({ cluster, onClose, hoveredToolId, onHoverTool, totalClusters, clusterIndex }) => {
    // Configuration
    const width = 800;
    const height = 400;
    const padding = { top: 40, right: 40, bottom: 40, left: 60 };
    const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

    // Generate Stream Data
    // Priority: Persistent History (DB) > Simulation (Fallback)
    const streams = useMemo(() => {
        if (!cluster || !cluster.tools) return [];

        return cluster.tools.map(tool => {
            let dataPoints = [];

            // 1. Check for persistent history (Source of Truth)
            if (tool.history && Array.isArray(tool.history)) {
                dataPoints = tool.history;
            }
            // 2. Fallback to Simulation
            else {
                const launchYear = tool.year || 2023;
                dataPoints = years.map(year => {
                    let value = 0;
                    if (year >= launchYear) {
                        const age = year - launchYear;
                        const peak = 10 + (tool.name.length % 5) * 5;
                        value = peak * (1 / (1 + Math.exp(-age + 2)));
                    }
                    return { year, value };
                });
            }

            return {
                tool,
                dataPoints,
                color: cluster.color
            };
        });
    }, [cluster]);

    if (!cluster) return null;

    // Stack Logic (Simple baseline accumulation)
    // We need to calculate y0 and y1 for each point
    const stackedData = [];
    const totalsPerYear = new Array(years.length).fill(0);

    // First pass: calculate totals to center the stream? 
    // For now, let's just stack from bottom (Baseline 0)

    // We iterate years, then tools to build the stack
    const layers = streams.map(stream => {
        return stream.dataPoints.map((dp, i) => {
            const y0 = totalsPerYear[i];
            const y1 = y0 + dp.value;
            totalsPerYear[i] = y1; // Update total for next layer
            return { x: dp.year, y0, y1, value: dp.value };
        });
    });

    // Scales
    const maxTotal = Math.max(...totalsPerYear, 10); // Avoid 0 div
    const xScale = (year) => padding.left + ((year - years[0]) / (years[years.length - 1] - years[0])) * (width - padding.left - padding.right);
    const yScale = (val) => height - padding.bottom - (val / maxTotal) * (height - padding.top - padding.bottom);

    // Path Generation
    const generateAreaPath = (layer) => {
        // Top line (forward)
        const top = layer.map(p => `L ${xScale(p.x)} ${yScale(p.y1)}`).join(" ");
        // Bottom line (backward)
        const bottom = layer.slice().reverse().map(p => `L ${xScale(p.x)} ${yScale(p.y0)}`).join(" ");

        // Start point
        const start = `M ${xScale(layer[0].x)} ${yScale(layer[0].y0)}`;

        return `${start} ${top.substring(1)} L ${xScale(layer[layer.length - 1].x)} ${yScale(layer[layer.length - 1].y0)} ${bottom.substring(1)} Z`;
    };

    // Color Helpers
    // Full Spectrum Energy Scale (Thermal/Turbo-like)
    // Low Energy (Stable/Small) -> High Energy (Growth/Large)
    const getSpectrumColor = (intensity) => {
        // Intensity 0..1
        // Map to HSL hue: 220 (Blue) -> 0 (Red)
        // We want a "Hot" scale.
        // 0.0 -> Blue (220)
        // 0.5 -> Green
        // 1.0 -> Red (0)

        const hue = 220 - (intensity * 220);
        const sat = 80 + (intensity * 20); // 80% -> 100%
        const light = 50 + (intensity * 10); // 50% -> 60%

        return `hsl(${hue}, ${sat}%, ${light}%)`;
    };

    // Pre-calc max thickness across all layers for normalization
    let globalMaxThickness = 0;
    layers.forEach(layer => {
        let maxT = 0;
        layer.forEach(p => { const t = p.y1 - p.y0; if (t > maxT) maxT = t; });
        if (maxT > globalMaxThickness) globalMaxThickness = maxT;
    });

    // End of layers logic

    // Default to center (Fixed Position as per user request to keep animation but centered)
    let positionClass = "left-1/2 -translate-x-1/2";

    return (
        <div className={`fixed inset-0 z-50 pointer-events-none flex items-center transition-all duration-500`}>
            {/* Backdrop removed to allow clicking map? Or keep dim? User wants to see nodes. Keep faint dim. */}
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

            <div className={`bg-[#050712]/90 border border-white/20 rounded-xl w-[900px] max-w-[85vw] shadow-2xl overflow-hidden relative backdrop-blur-xl pointer-events-auto absolute ${positionClass} transition-all duration-700 ease-out`}>

                {/* Header... */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0a0f26]">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cluster.color }}></span>
                            {window.ManifoldI18n.translateData(cluster.label)}
                        </h2>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Historical Evolution (Chromatic Scale)</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">✕</button>
                </div>

                <div className="p-6 overflow-hidden">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[60vh] mx-auto block">
                        <g className="grid-layer">
                            {years.map(year => (
                                <g key={year}>
                                    <line x1={xScale(year)} y1={padding.top} x2={xScale(year)} y2={height - padding.bottom} stroke="rgba(255,255,255,0.05)" />
                                    <text x={xScale(year)} y={height - 10} textAnchor="middle" fill="#6b7280" fontSize="12" className="font-mono">{year}</text>
                                </g>
                            ))}
                        </g>

                        {/* Streams with Chromatic Scale */}
                        {layers.map((layer, i) => {
                            let maxThickness = 0;
                            let maxIdx = -1;
                            layer.forEach((p, idx) => {
                                const thickness = p.y1 - p.y0;
                                if (thickness > maxThickness) {
                                    maxThickness = thickness;
                                    maxIdx = idx;
                                }
                            });

                            const labelPoint = maxIdx !== -1 ? layer[maxIdx] : null;
                            const showLabel = maxThickness > (maxTotal * 0.08);

                            // Calculate Intensity
                            const intensity = globalMaxThickness > 0 ? (maxThickness / globalMaxThickness) : 0;
                            const energeticColor = getSpectrumColor(intensity);

                            // Visual Sync Logic
                            const isHovered = hoveredToolId === streams[i].tool.name;
                            const isDimmed = hoveredToolId && !isHovered;

                            return (
                                <g key={i}
                                    className={`group transition-all duration-300 ${isDimmed ? 'opacity-20' : 'opacity-90'} ${isHovered ? 'z-20 opacity-100' : 'hover:z-10'}`}
                                    onMouseEnter={() => onHoverTool && onHoverTool(streams[i].tool.name)}
                                    onMouseLeave={() => onHoverTool && onHoverTool(null)}
                                >
                                    <path
                                        d={generateAreaPath(layer)}
                                        fill={energeticColor}
                                        fillOpacity={isHovered ? 1 : 0.85}
                                        stroke={isHovered ? "#fff" : energeticColor}
                                        strokeWidth={isHovered ? "2" : "0.5"}
                                        className="transition-all duration-300"
                                    />

                                    {/* Direct Label */}
                                    {showLabel && labelPoint && (
                                        <text
                                            x={xScale(labelPoint.x)}
                                            y={yScale((labelPoint.y0 + labelPoint.y1) / 2)}
                                            textAnchor="middle"
                                            alignmentBaseline="middle"
                                            fill="white"
                                            fontSize="10"
                                            fontWeight="bold"
                                            className="pointer-events-none drop-shadow-md select-none opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all"
                                            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                                        >
                                            {streams[i].tool.name}
                                        </text>
                                    )}
                                    <title>{streams[i].tool.name} ({streams[i].tool.year})</title>
                                </g>
                            );
                        })}
                    </svg>

                    <div className="mt-4 text-center text-gray-500 text-sm">
                        * {window.ManifoldI18n?.t ? window.ManifoldI18n.t("streamargraph.note") : "Height represents aggregated relative importance over time."}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Expose globally for App.js
window.ManifoldStreamgraph = Streamgraph;
