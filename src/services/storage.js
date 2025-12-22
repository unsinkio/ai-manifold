window.ManifoldStorage = {
    KEY: 'manifold_db_v1',

    getDB: function () {
        const raw = localStorage.getItem(this.KEY);
        if (!raw) return this.initDB();
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.error("Corrupt DB, resetting", e);
            return this.initDB();
        }
    },

    saveDB: function (db) {
        localStorage.setItem(this.KEY, JSON.stringify(db));
    },

    initDB: function () {
        const initial = {
            userProfile: {
                sector: "",
                jobDescription: "",
                tasks: []
            },
            reviews: [], // [{ toolId, sector, ratings: {}, fitScore }]
            customTools: []
        };
        this.saveDB(initial);
        return initial;
    },

    // --- Profile Methods ---
    getProfile: function () {
        return this.getDB().userProfile;
    },

    saveProfile: function (profile) {
        const db = this.getDB();
        db.userProfile = { ...db.userProfile, ...profile };
        this.saveDB(db);
        return db.userProfile;
    },

    // --- Review Methods ---
    saveReview: function (reviewData) {
        // reviewData: { toolId, ratings: { accuracy: 5... } }
        const db = this.getDB();
        const sector = db.userProfile.sector || "General";

        // Calculate simple fit score (average of ratings * 20 to get 0-100)
        const values = Object.values(reviewData.ratings);
        const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);
        const fitScore = Math.round(avg * 20);

        const newReview = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            sector,
            fitScore,
            ...reviewData
        };

        // Remove old review for same tool if exists
        db.reviews = db.reviews.filter(r => r.toolId !== reviewData.toolId);
        db.reviews.push(newReview);

        this.saveDB(db);
        return newReview;
    },

    getReviewForTool: function (toolId) {
        const db = this.getDB();
        return db.reviews.find(r => r.toolId === toolId);
    },

    getReviewsBySector: function (sector) {
        const db = this.getDB();
        return db.reviews.filter(r => r.sector === sector);
    }
};
