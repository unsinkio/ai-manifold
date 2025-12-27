const { useState, useEffect, useRef } = React;

// Helper: Polar to Cartesian
function pol2cart(r, angleRad, cx, cy) {
    return {
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad)
    };
}

// RadialMap Component
window.RadialMap = function RadialMap({ onClusterSelect, selectedClusterId, searchTerm = '', hoveredToolId = null, onHoverTool = () => { }, customTools = [] }) {
    // Access new Tensor Data
    const domains = window.ManifoldData.domains || [];
    let tensor = window.ManifoldData.tensor ? [...window.ManifoldData.tensor] : [];
    let tools = window.ManifoldData.tools ? [...window.ManifoldData.tools] : [];

    // --- MERGE CUSTOM TOOLS ---
    if (customTools && customTools.length > 0) {
        customTools.forEach(ct => {
            // Add to Tools list
            tools.push({
                id: ct.id,
                name: ct.name,
                description: { es: ct.description, en: ct.description }, // Basic i18n support
                year: ct.year,
                isCustom: true
            });

            // Add to Tensor (Primary Domain)
            if (ct.primaryDomain) {
                tensor.push({ toolId: ct.id, domainId: ct.primaryDomain, weight: 1.0 });
            }

            // Add to Tensor (Secondary Domains)
            if (ct.secondaryDomains && Array.isArray(ct.secondaryDomains)) {
                ct.secondaryDomains.forEach(sdId => {
                    tensor.push({ toolId: ct.id, domainId: sdId, weight: 0.7 }); // Slightly less weight
                });
            }
        });
    }

    // Fallback if data not ready
    if (!domains.length) return null;

    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const containerRef = useRef(null);

    // Responsive Logic
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) setDimensions({ width, height });
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const { width, height } = dimensions;
    const cx = width / 2;
    const cy = height / 2;
    const baseRadius = Math.min(width, height) * 0.35; // Usage space

    // 1. Calculate Domain Angles (Fixed Frames)
    const angleStep = (Math.PI * 2) / domains.length;
    const domainGeometry = domains.map((d, i) => {
        const midAngle = i * angleStep - Math.PI / 2;
        return {
            ...d,
            midAngle,
            startAngle: midAngle - angleStep / 2,
            endAngle: midAngle + angleStep / 2
        };
    });

    // 2. Calculate Tool Positions (Tensor Projection)
    const computedTools = tools.map(tool => {
        // Get tensor vector
        const entries = tensor.filter(e => e.toolId === tool.id);

        // If no data, default to edge/first domain?
        if (entries.length === 0) return { ...tool, r: baseRadius, angle: 0, x: cx + baseRadius, y: cy, color: "#999", entropy: 0 };

        // Aggregation for Angle (Circular Mean)
        let sumSin = 0;
        let sumCos = 0;
        let totalWeight = 0;

        entries.forEach(e => {
            const domain = domainGeometry.find(d => d.id === e.domainId);
            if (domain) {
                const w = e.weight || 1;
                sumSin += w * Math.sin(domain.midAngle);
                sumCos += w * Math.cos(domain.midAngle);
                totalWeight += w;
            }
        });

        const angle = Math.atan2(sumSin, sumCos);

        // Aggregation for Radius (Entropy / Generality)
        // H(t) = - sum(p * log(p))
        let entropy = 0;
        entries.forEach(e => {
            const p = (e.weight || 1) / totalWeight;
            if (p > 0) entropy -= p * Math.log(p);
        });

        // Normalize Entropy: H_n = H / log(N)
        const maxEntropy = Math.log(domains.length);
        const normalizedEntropy = totalWeight > 0 ? (entropy / maxEntropy) : 0; // 0 (Specialized) to 1 (General)

        // Map to Radius: 
        // High Entropy (General) -> Center (Small Radius)
        // Low Entropy (Specialized) -> Edge (Large Radius)
        const minR = baseRadius * 0.2;
        const maxR = baseRadius * 1.2;

        // Invert: 1 - Hn
        const r = minR + (1 - normalizedEntropy) * (maxR - minR);

        const pos = pol2cart(r, angle, cx, cy);

        // Check search
        const isMatch = searchTerm && tool.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Determine "Primary" Sector for color (Max Weight)
        // Safety check if entries exist
        const primaryEntry = entries.length > 0 ? entries.reduce((prev, current) => (prev.weight > current.weight) ? prev : current) : null;
        const primaryDomain = primaryEntry ? domains.find(d => d.id === primaryEntry.domainId) : null;
        const color = primaryDomain ? primaryDomain.color : "#ccc";

        // --- GEODESIC TRAIL CALCULATION ---
        let trailPath = null;
        if (tool.history && tool.history.length > 0) {
            // Compute Previous Position
            // Simplified: Just use the first history point (origin)
            const hist = tool.history[0];
            const histDomain = domainGeometry.find(d => d.id === hist.domainId);

            if (histDomain) {
                // Previous Angle (Single domain for now, or weighted if array)
                const prevAngle = histDomain.midAngle;

                // Previous Radius (Entropy)
                // Single domain = Low Entropy = High Radius (Specialized)
                // Let's simplify: History usually implies specialization -> generalization
                const prevR = baseRadius * 1.0;

                const prevPos = pol2cart(prevR, prevAngle, cx, cy);

                // Create curved path (Geodesic)
                // Q = Control Point
                const cp = { x: (prevPos.x + pos.x) / 2, y: (prevPos.y + pos.y) / 2 };
                trailPath = `M ${prevPos.x} ${prevPos.y} Q ${cp.x} ${cp.y} ${pos.x} ${pos.y}`;
            }
        }

        return {
            ...tool,
            x: pos.x,
            y: pos.y,
            r,
            angle,
            color,
            isMatch,
            entropy: normalizedEntropy,
            trailPath
        };
    });

    const hasSearchMatch = computedTools.some(t => t.isMatch);

    return (
        <div ref={containerRef} className="w-full h-full relative radial-gradient-bg" onClick={() => onClusterSelect(null)}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* --- 1. Background Grid (Generality Zones) --- */}
                {/* Center (General) -> Outer (Specialized) */}
                {[0.2, 0.5, 0.8, 1.1].map((scale, i) => (
                    <circle key={i} cx={cx} cy={cy} r={baseRadius * scale}
                        fill="none" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                ))}

                {/* --- 2. Sectors (Domains) --- */}
                {domainGeometry.map(domain => {
                    const isSelected = selectedClusterId === domain.id;
                    const innerR = baseRadius * 0.2; // Start from core
                    const outerR = baseRadius * 1.3;

                    // Arc Path
                    const p1 = pol2cart(innerR, domain.startAngle, cx, cy);
                    const p2 = pol2cart(innerR, domain.endAngle, cx, cy);
                    const p3 = pol2cart(outerR, domain.endAngle, cx, cy);
                    const p4 = pol2cart(outerR, domain.startAngle, cx, cy);

                    const largeArc = (domain.endAngle - domain.startAngle) <= Math.PI ? "0" : "1";

                    const path = `M ${p1.x} ${p1.y} A ${innerR} ${innerR} 0 ${largeArc} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${outerR} ${outerR} 0 ${largeArc} 0 ${p4.x} ${p4.y} Z`;

                    return (
                        <g key={domain.id} onClick={(e) => { e.stopPropagation(); onClusterSelect(domain.id); }} className="cursor-pointer group">
                            <path
                                d={path}
                                fill={domain.color}
                                fillOpacity={isSelected ? 0.10 : 0.01}
                                stroke="none"
                                className="transition-all duration-500 group-hover:fill-opacity-[0.04]"
                            />

                            {/* Label at edge */}
                            <text
                                x={pol2cart(baseRadius * 1.4, domain.midAngle, cx, cy).x}
                                y={pol2cart(baseRadius * 1.4, domain.midAngle, cx, cy).y}
                                fill={isSelected ? "#fff" : domain.color}
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                fontSize={isSelected ? 12 : 10}
                                opacity={isSelected ? 1 : 0.4}
                                className="pointer-events-none select-none transition-all"
                            >
                                {window.ManifoldI18n.translateData(domain.label)}
                            </text>
                        </g>
                    );
                })}

                {/* --- 3. Tools (Projected Entities) --- */}
                {computedTools.map((tool, i) => {
                    const isHovered = hoveredToolId === tool.name;
                    const isDimmed = (hoveredToolId && !isHovered) || (searchTerm && !tool.isMatch);

                    // Size logic
                    const size = isHovered ? 8 : (4 + (tool.entropy * 3)); // More general = slightly larger for visibility

                    return (
                        <g key={tool.id}
                            className={`transition-all duration-500 ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
                            style={{ transformOrigin: `${tool.x}px ${tool.y}px`, transform: isHovered ? 'scale(1.5)' : 'scale(1)' }}
                            onMouseEnter={() => onHoverTool(tool.name)}
                            onMouseLeave={() => onHoverTool(null)}
                        >
                            {/* --- TRAIL / WAKE (Geodesic History) --- */}
                            {/* Only visible on Hover or Search Match */}
                            {tool.trailPath && (isHovered || tool.isMatch) && (
                                <g className="animate-fadeIn">
                                    {/* Trail Line */}
                                    <path
                                        d={tool.trailPath}
                                        fill="none"
                                        stroke={tool.color}
                                        strokeWidth="2.5"
                                        strokeDasharray="4 3"
                                        strokeLinecap="round"
                                        opacity="0.9"
                                    />
                                    {/* Origin Dot (Ghost) */}
                                    <circle cx={tool.trailPath.split(' ')[1]} cy={tool.trailPath.split(' ')[2]} r="3" fill={tool.color} opacity="0.6" />
                                </g>
                            )}

                            {/* Halo for high entropy (General tools) -> "Glowing Core" effect */}
                            {tool.entropy > 0.3 && (
                                <circle cx={tool.x} cy={tool.y} r={size + 4} fill={tool.color} fillOpacity="0.1" />
                            )}

                            <circle cx={tool.x} cy={tool.y} r={size} fill={tool.color} stroke={isHovered || tool.isMatch ? "#fff" : "none"} strokeWidth={1} />

                            {/* Label */}
                            {(isHovered || tool.isMatch || tool.entropy > 0.5) && (
                                <text x={tool.x} y={tool.y - size - 4} textAnchor="middle" fill="#fff" fontSize="10" className="pointer-events-none select-none shadow-black drop-shadow-md">
                                    {tool.name}
                                </text>
                            )}
                        </g>
                    );
                })}

            </svg>

            {/* Legend / Info Overlay */}
            <div className="absolute bottom-4 left-4 text-xs text-gray-500 max-w-xs pointer-events-none">
                <p><strong>Center:</strong> General Purpose (High Entropy)</p>
                <p><strong>Periphery:</strong> Specialized (Low Entropy)</p>
            </div>
        </div>
    );
};
