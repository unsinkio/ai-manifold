// Basic Clustering Logic
window.ManifoldClustering = {
    calculateToolPosition: function (toolId) {
        // Placeholder for future physics-based positioning
        return { x: 0, y: 0 };
    },

    // Returns a normalized score (0-1) for a cluster/sector based on user reviews
    getClusterAffinity: function (sectorName) {
        const db = window.ManifoldStorage.getDB();
        const reviews = db.reviews.filter(r => r.sector === sectorName);

        if (reviews.length === 0) return 0;

        // Calculate average fit score for this sector
        const totalScore = reviews.reduce((acc, r) => acc + r.fitScore, 0);
        const avgScore = totalScore / reviews.length; // 0-100

        // Normalize to 0-1 range for visual opacity
        return Math.min(Math.max(avgScore / 100, 0), 1);
    },

    // Returns tools for a sector, sorted by user fit score (descending)
    getRecommendedTools: function (sectorName, allTools) {
        const db = window.ManifoldStorage.getDB();

        // 1. Create a map of toolId -> best review score
        const toolScores = {};
        db.reviews.forEach(r => {
            if (!toolScores[r.toolId] || r.fitScore > toolScores[r.toolId]) {
                toolScores[r.toolId] = r.fitScore;
            }
        });

        // 2. Enhance tools with score
        const toolsWithScores = allTools.map(tool => {
            // Match by ID or Name (legacy)
            const id = tool.id || tool.name.toLowerCase().replace(/\s+/g, '-');
            const score = toolScores[id] || 0;
            return { ...tool, id, score };
        });

        // 3. Sort: High score first
        return toolsWithScores.sort((a, b) => b.score - a.score);
    }
};
