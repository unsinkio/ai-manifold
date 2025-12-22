const { useState, useEffect, useRef } = React;
// Access data from window global
const clusters = window.ManifoldData ? window.ManifoldData.clusters : [];
const coreNodes = window.ManifoldData ? window.ManifoldData.coreNodes : [];

function pol2cart(r, angleRad, cx, cy) {
    return {
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad)
    };
}

// Assign component to window
window.RadialMap = function RadialMap({ onClusterSelect, selectedClusterId }) {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    // Responsive logic
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { width, height } = dimensions;
    const cx = width / 2;
    const cy = height / 2;
    const baseRadius = Math.min(width, height) * 0.35; // Slightly larger than original

    // Geometry calculations
    const coreRadius = baseRadius * 0.4;
    const arcInner = baseRadius * 0.9;
    const arcOuter = baseRadius * 1.35;

    // -- Core Nodes Positions --
    const coreAngleStep = (Math.PI * 2) / (coreNodes.length || 1);
    const corePositions = coreNodes.map((node, i) => {
        const angle = i * coreAngleStep - Math.PI / 2;
        return { ...node, ...pol2cart(coreRadius, angle, cx, cy) };
    });

    // -- Cluster Arcs & Nodes Positions --
    // Handle empty clusters gracefully
    if (!clusters || clusters.length === 0) return null;

    const angleStep = (Math.PI * 2) / clusters.length;
    const clusterElements = clusters.map((cluster, i) => {
        const startAngle = i * angleStep - Math.PI / 2;
        const endAngle = startAngle + angleStep * 0.9;
        const midAngle = (startAngle + endAngle) / 2;

        const p1 = pol2cart(arcInner, startAngle, cx, cy);
        const p2 = pol2cart(arcInner, endAngle, cx, cy);
        const p3 = pol2cart(arcOuter, endAngle, cx, cy);
        const p4 = pol2cart(arcOuter, startAngle, cx, cy);

        const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

        const pathData = [
            "M", p1.x, p1.y,
            "A", arcInner, arcInner, 0, largeArcFlag, 1, p2.x, p2.y,
            "L", p3.x, p3.y,
            "A", arcOuter, arcOuter, 0, largeArcFlag, 0, p4.x, p4.y,
            "Z"
        ].join(" ");

        const nodeR = (arcInner + arcOuter) / 2;
        const nodePos = pol2cart(nodeR, midAngle, cx, cy);

        // Calculate label position slightly outside
        const labelPos = pol2cart(arcOuter + 20, midAngle, cx, cy);

        return {
            cluster,
            pathData,
            nodePos,
            labelPos,
            currentAngle: midAngle
        };
    });

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative radial-gradient-bg"
            onClick={() => onClusterSelect(null)} // Click anywhere on background repalces the z-index div
        >
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* --- Background Rings --- */}
                {[baseRadius * 0.6, baseRadius, baseRadius * 1.3].map((r, i) => (
                    <circle
                        key={i}
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeDasharray="4 4"
                        className="pointer-events-none"
                    />
                ))}

                {/* --- Links (Core to Cluster) --- */}
                {clusterElements.map((ce, i) => {
                    const coreNode = corePositions[i % corePositions.length];
                    const isDimmed = selectedClusterId && selectedClusterId !== ce.cluster.id;
                    return (
                        <line
                            key={`link-${i}`}
                            x1={coreNode.x} y1={coreNode.y}
                            x2={ce.nodePos.x} y2={ce.nodePos.y}
                            stroke="rgba(200, 205, 255, 0.2)"
                            strokeWidth="1"
                            className={`transition-opacity duration-300 pointer-events-none ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                        />
                    );
                })}

                {/* --- Core Halo --- */}
                <circle
                    cx={cx} cy={cy} r={coreRadius * 0.6}
                    fill="none"
                    stroke="rgba(157,162,255,0.2)"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                    className="pointer-events-none"
                />

                {/* --- Core Nodes --- */}
                {corePositions.map((pos) => (
                    <g key={pos.id} className="cursor-default pointer-events-none">
                        <circle
                            cx={pos.x} cy={pos.y} r={6}
                            fill="#fff" fillOpacity="0.9"
                            stroke="rgba(157,162,255,0.9)"
                            strokeWidth="1.5"
                        />
                        <text
                            x={pos.x + 10} y={pos.y + 4}
                            fill="#d7dbff"
                            fontSize="10"
                            fontFamily="system-ui"
                            className="pointer-events-none select-none"
                        >
                            {pos.label}
                        </text>
                    </g>
                ))}

                {/* --- Center Text --- */}
                <text
                    x={cx} y={cy + coreRadius * 0.8}
                    textAnchor="middle"
                    fill="#9da2ff"
                    fontSize="11"
                    className="opacity-70 pointer-events-none select-none"
                >
                    Núcleo de IA
                </text>

                {/* --- Cluster Arcs & Nodes --- */}
                {clusterElements.map((el) => {
                    const isSelected = selectedClusterId === el.cluster.id;
                    const isDimmed = selectedClusterId && !isSelected;

                    // Increased opacity from 10 to 40 for better visibility
                    return (
                        <g
                            key={el.cluster.id}
                            onClick={(e) => { e.stopPropagation(); onClusterSelect(el.cluster.id); }}
                            className={`cursor-pointer transition-all duration-300 ${isDimmed ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}
                        >
                            {/* Arc Shape */}
                            <path
                                d={el.pathData}
                                fill={el.cluster.color}
                                fillOpacity={isSelected ? 0.2 : 0.08}
                                stroke={el.cluster.color}
                                strokeWidth={isSelected ? 3 : 2}
                                strokeOpacity={0.6}
                                className="transition-all duration-300 ease-out hover:fill-opacity-20"
                            />

                            {/* Node Circle */}
                            <circle
                                cx={el.nodePos.x} cy={el.nodePos.y}
                                r={isSelected ? 8 : 5}
                                fill={el.cluster.color}
                                stroke="#02030a"
                                strokeWidth="1.5"
                                className="transition-all duration-300"
                            />

                            {/* Label */}
                            <text
                                x={el.labelPos.x} y={el.labelPos.y}
                                fill="#f1f3ff"
                                fontSize="11"
                                textAnchor={el.labelPos.x >= cx ? "start" : "end"}
                                alignmentBaseline="middle"
                                className="select-none font-medium drop-shadow-md"
                            >
                                {el.cluster.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
