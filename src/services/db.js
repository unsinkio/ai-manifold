// Firestore Database Service
window.ManifoldDB = {
    db: null,

    init: function () {
        if (!firebase || !firebase.firestore) {
            console.error("Firebase Firestore SDK not loaded");
            return;
        }
        this.db = firebase.firestore();
        console.log("Firestore Initialized");
    },

    // --- User Profile ---
    getUserProfile: async function (userId) {
        if (!this.db) return null;
        try {
            const doc = await this.db.collection('users').doc(userId).get();
            if (doc.exists) {
                return doc.data().profile;
            }
            return null;
        } catch (e) {
            console.error("Error fetching profile:", e);
            throw e;
        }
    },

    saveUserProfile: async function (userId, profileData) {
        if (!this.db) return;
        try {
            // Merge true to avoid overwriting other user data if any
            await this.db.collection('users').doc(userId).set({
                profile: profileData,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } catch (e) {
            console.error("Error saving profile:", e);
            throw e;
        }
    },

    // --- Reviews ---
    // Storing reviews in a subcollection: users/{userId}/reviews/{reviewId}
    // and ALSO optionally in a root collection 'reviews' for global analytics later (Phase 4).
    // For now, let's keep it simple: Subcollection for the user's view.

    saveReview: async function (userId, reviewData) {
        if (!this.db) return;
        try {
            // reviewData should include toolId, ratings, fitScore
            const reviewId = reviewData.toolId; // One review per tool per user

            await this.db.collection('users').doc(userId).collection('reviews').doc(reviewId).set({
                ...reviewData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("Review saved to cloud");
        } catch (e) {
            console.error("Error saving review:", e);
            throw e;
        }
    },

    getUserReviews: async function (userId) {
        if (!this.db) return [];
        try {
            const snapshot = await this.db.collection('users').doc(userId).collection('reviews').get();
            return snapshot.docs.map(doc => doc.data());
        } catch (e) {
            console.error("Error fetching reviews:", e);
            return [];
        }
    },

    // --- Custom Tools (User Generated) ---
    saveCustomTool: async function (userId, toolData) {
        if (!this.db) return;
        try {
            // tools stored in users/{userId}/custom_tools
            const newToolRef = this.db.collection('users').doc(userId).collection('custom_tools').doc();
            await newToolRef.set({
                id: newToolRef.id,
                ...toolData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("Custom tool saved");
            return { id: newToolRef.id, ...toolData };
        } catch (e) {
            console.error("Error saving custom tool:", e);
            throw e;
        }
    },

    getCustomTools: async function (userId) {
        if (!this.db) return [];
        try {
            const snapshot = await this.db.collection('users').doc(userId).collection('custom_tools').orderBy('timestamp', 'desc').get();
            return snapshot.docs.map(doc => doc.data());
        } catch (e) {
            console.error("Error fetching custom tools:", e);
            return [];
        }
    },

    // --- Migration Helper ---
    // Syncs local data to cloud one-time
    migrateLocalData: async function (userId, localData) {
        if (!localData) return;

        const batch = this.db.batch();
        const userRef = this.db.collection('users').doc(userId);

        // 1. Profile
        if (localData.userProfile) {
            batch.set(userRef, {
                profile: localData.userProfile,
                migratedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        // 2. Reviews
        if (localData.reviews && localData.reviews.length > 0) {
            localData.reviews.forEach(review => {
                const reviewRef = userRef.collection('reviews').doc(review.toolId);
                // Clean up review object if needed
                const { id, ...cleanReview } = review;
                batch.set(reviewRef, {
                    ...cleanReview,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
        }

        await batch.commit();
        console.log("Migration completed successfully");
    },
    // --- Ontology (Cloud + Fallback) ---
    // Seed local clusters.js data to Firestore (Admin / One-time)
    seedOntology: async function () {
        if (!this.db) return;
        const clusters = window.ManifoldData ? window.ManifoldData.clusters : [];
        if (clusters.length === 0) {
            console.error("No local clusters found to seed");
            return;
        }

        const batch = this.db.batch();
        const ontologyRef = this.db.collection('ontology');

        clusters.forEach(cluster => {
            const ref = ontologyRef.doc(cluster.id);
            batch.set(ref, cluster);
        });

        try {
            await batch.commit();
            console.log("Ontology seeded successfully!");
            window.dispatchEvent(new CustomEvent('manifold-toast', {
                detail: { message: "Ontología subida a la nube correctamente.", type: 'success' }
            }));
        } catch (e) {
            console.error("Error seeding ontology:", e);
        }
    },

    // Get ontology once (legacy/fallback)
    getOntology: async function () {
        const localClusters = window.ManifoldData ? window.ManifoldData.clusters : [];
        if (!this.db) return localClusters;
        try {
            const snapshot = await this.db.collection('ontology').get();
            if (snapshot.empty) return localClusters;
            return snapshot.docs.map(doc => doc.data());
        } catch (e) {
            return localClusters;
        }
    },

    // Real-time Ontology Subscription
    subscribeToOntology: function (cb) {
        const localClusters = window.ManifoldData ? window.ManifoldData.clusters : [];
        if (!this.db) {
            cb(localClusters);
            return () => { }; // No-op unsubscribe
        }

        // Listen for updates
        return this.db.collection('ontology').onSnapshot(snapshot => {
            if (snapshot.empty) {
                cb(localClusters);
            } else {
                const cloudClusters = snapshot.docs.map(doc => doc.data());
                cb(cloudClusters);
            }
        }, error => {
            console.warn("Ontology Sync Error (Offline?):", error);
            // On error (offline), keep showing what we have or fallback? 
            // Better not to override if we already had data.
            // cb(localClusters); 
        });
    }
};
