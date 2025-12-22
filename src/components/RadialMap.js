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
// Assign component to window
window.RadialMap = function RadialMap({ onClusterSelect, selectedClusterId, clusterScores = {}, customTools = [], userCoreNodes = null }) {
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

    // ADJUSTED GEOMETRY: Smaller radius to prevent clipping
    const baseRadius = Math.min(width, height) * 0.28;

    // -- Core Nodes Positions --
    // Use user nodes if provided, otherwise default static
    const activeCoreNodes = userCoreNodes || coreNodes;

    const coreRadius = baseRadius * 0.5; // More space for core
    const coreAngleStep = (Math.PI * 2) / (activeCoreNodes.length || 1);
    const corePositions = activeCoreNodes.map((node, i) => {
        const angle = i * coreAngleStep - Math.PI / 2;
        return { ...node, ...pol2cart(coreRadius, angle, cx, cy) };
    });

    if (!clusters || clusters.length === 0) return null;

    const angleStep = (Math.PI * 2) / clusters.length;

    // -- Prepare Cluster Data with Reactive Geometry --
    const clusterElements = clusters.map((cluster, i) => {
        const score = clusterScores[cluster.id] || 0; // 0 to 1

        // REACTIVE GEOMETRY: Radius expands with score
        // Base sizes
        const baseInner = baseRadius * 0.9;
        const baseOuter = baseRadius * 1.35;

        // Expansion factor (up to 15% larger)
        const expansion = score * (baseRadius * 0.15);

        const arcInner = baseInner; // Inner stays fixed for stability
        const arcOuter = baseOuter + expansion; // Outer grows

        const startAngle = i * angleStep - Math.PI / 2;
        const endAngle = startAngle + angleStep * 0.9;
        const midAngle = (startAngle + endAngle) / 2;

        // Calculate Arc Path
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
        const labelPos = pol2cart(arcOuter + 25, midAngle, cx, cy);

        // -- SATELLITE NODES (Tools) --
        // Merge static + custom tools for this cluster
        const clusterCustomTools = customTools.filter(t => t.sectorId === cluster.id);
        const allTools = [...(cluster.tools || []), ...clusterCustomTools];

        // Distribute tools along an orbit just outside the cluster
        const orbitRadius = arcOuter + 10;
        const totalTools = allTools.length;

        const satellites = allTools.map((tool, idx) => {
            // Distribute evenly within the arc's angle range
            // map idx 0..total to start..end
            const step = (endAngle - startAngle) / (totalTools + 1);
            const toolAngle = startAngle + step * (idx + 1);
            return {
                ...tool,
                pos: pol2cart(orbitRadius, toolAngle, cx, cy),
                angle: toolAngle
            };
        });

        return {
            cluster,
            pathData,
            nodePos,
            labelPos,
            score,
            arcOuter, // for connector start point
            currentAngle: midAngle,
            satellites
        };
    });

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative radial-gradient-bg"
            onClick={() => onClusterSelect(null)}
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
                    <filter id="heatGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* --- Background Topology (Rings) --- */}
                {[baseRadius * 0.6, baseRadius, baseRadius * 1.35].map((r, i) => (
                    <circle
                        key={i}
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke="rgba(255,255,255,0.04)"
                        strokeDasharray="4 4"
                        className="pointer-events-none"
                    />
                ))}

                {/* --- Synapses (Semantic Connections) --- */}
                {/* Draw lines from Active Core Nodes to their respective Clusters */}
                {activeCoreNodes.map((coreNode, i) => {
                    // Find which clusters contains this tool
                    // We need to match coreNode.id (or label) with cluster tools
                    const targetClustersIds = clusters.filter(c => {
                        // Check static tools
                        const hasStatic = c.tools.some(t => {
                            // Match by ID, Name or Slug
                            const cid = t.id || t.name.toLowerCase().replace(/\s+/g, '-');
                            return cid === coreNode.id || t.name === coreNode.label;
                        });
                        // Check custom tools (if they have sectorId matching cluster.id)
                        // Actually coreNode might carry sector info if passed from topReviews
                        return hasStatic;
                    }).map(c => c.id);

                    // Also check if coreNode came with sectorId (custom tool)
                    if (coreNode.sectorId && !targetClustersIds.includes(coreNode.sectorId)) {
                        targetClustersIds.push(coreNode.sectorId);
                    }

                    return targetClustersIds.map(clusterId => {
                        const clusterIndex = clusters.findIndex(c => c.id === clusterId);
                        if (clusterIndex === -1) return null;

                        const clusterElement = clusterElements[clusterIndex];
                        if (!clusterElement) return null;

                        // Calculate points
                        const start = corePositions[i];
                        const end = clusterElement.nodePos;

                        // Control point for curvature
                        const cp = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };

                        return (
                            <path
                                key={`synapse-${coreNode.id}-${clusterId}`}
                                d={`M ${start.x} ${start.y} Q ${cp.x} ${cp.y} ${end.x} ${end.y}`}
                                fill="none"
                                stroke={`rgba(157, 162, 255, ${0.4 + clusterElement.score * 0.6})`}
                                strokeWidth={1 + clusterElement.score * 2}
                                strokeDasharray={clusterElement.score > 0.6 ? "4 3" : "none"}
                                className="pointer-events-none"
                            >
                                {clusterElement.score > 0.6 && (
                                    <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1.5s" repeatCount="indefinite" />
                                )}
                            </path>
                        );
                    });
                })}

                {/* --- Core --- */}
                <circle cx={cx} cy={cy} r={coreRadius * 0.6} fill="none" stroke="rgba(157,162,255,0.2)" strokeDasharray="2 4" className="pointer-events-none" />
                {corePositions.map((pos) => (
                    <g key={pos.id} className="cursor-default pointer-events-none">
                        <circle cx={pos.x} cy={pos.y} r={6} fill="#fff" fillOpacity="0.9" stroke="rgba(157,162,255,0.9)" strokeWidth="1.5" />
                        <text x={pos.x + 10} y={pos.y + 4} fill="#d7dbff" fontSize="10" className="pointer-events-none select-none">{pos.label}</text>
                    </g>
                ))}
                {/* REMOVED LABEL "Nucleo de IA" */}

                {/* --- Cluster Elements --- */}
                {clusterElements.map((el) => {
                    const isSelected = selectedClusterId === el.cluster.id;
                    const isDimmed = selectedClusterId && !isSelected;

                    // Style Logic
                    const fillOpacity = isDimmed ? 0.1 : (0.1 + el.score * 0.5);
                    const strokeWidth = (isSelected ? 2 : 1) + (el.score * 2);

                    return (
                        <g
                            key={el.cluster.id}
                            onClick={(e) => { e.stopPropagation(); onClusterSelect(el.cluster.id); }}
                            className={`cursor-pointer transition-all duration-500 ${isDimmed ? 'opacity-40' : ''}`}
                            style={{ filter: el.score > 0.4 ? 'url(#heatGlow)' : 'none' }}
                        >
                            {/* Arc */}
                            <path
                                d={el.pathData}
                                fill={el.cluster.color}
                                fillOpacity={fillOpacity}
                                stroke={el.cluster.color}
                                strokeWidth={strokeWidth}
                                strokeOpacity={0.5 + el.score * 0.5}
                                className="transition-all duration-700 ease-out"
                            />

                            {/* Center Node */}
                            <circle
                                cx={el.nodePos.x} cy={el.nodePos.y}
                                r={(isSelected ? 6 : 4) + (el.score * 4)}
                                fill={el.score > 0.6 ? '#fff' : el.cluster.color}
                                stroke={el.cluster.color}
                                strokeWidth="1"
                                className="transition-all duration-500"
                            />

                            {/* Label */}
                            <text
                                x={el.labelPos.x} y={el.labelPos.y}
                                fill={el.score > 0.6 ? "#fff" : "#aeb4d1"}
                                fontWeight={el.score > 0.6 ? "bold" : "normal"}
                                fontSize={isSelected ? "13" : "11"}
                                textAnchor={el.labelPos.x >= cx ? "start" : "end"}
                                alignmentBaseline="middle"
                                className="select-none transition-all duration-500"
                            >
                                {el.cluster.label} {el.score > 0.1 && "★"}
                            </text>

                            {/* --- SATELLITE NODES (Tools) --- */}
                            {/* Only show satellites if selected OR high score */}
                            {(isSelected || el.score > 0.2) && (
                                <g className="satellites animate-fadeIn">
                                    {el.satellites.map((tool, idx) => (
                                        <circle
                                            key={`sat-${idx}`}
                                            cx={tool.pos.x} cy={tool.pos.y}
                                            r={tool.isCustom ? 2.5 : 2} // Custom tools slightly larger
                                            fill={tool.isCustom ? "#fff" : el.cluster.color}
                                            fillOpacity={0.8}
                                            className="transition-all duration-500 hover:r-4"
                                        >
                                            <title>{tool.name} {tool.isCustom ? "(Custom)" : ""}</title>
                                        </circle>
                                    ))}
                                </g>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
