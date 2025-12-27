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
    // --- Ontology Seeding (History Generation) ---
    // Generates "simulation" data once and persists it to create a "Real History" record.
    seedHistory: async function () {
        if (!this.db) return;
        const localClusters = window.ManifoldData ? window.ManifoldData.clusters : [];
        if (localClusters.length === 0) {
            console.error("No local clusters found to seed");
            return;
        }

        console.log("Seeding history...");
        const batch = this.db.batch();
        const ontologyRef = this.db.collection('ontology');
        const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

        localClusters.forEach(cluster => {
            const ref = ontologyRef.doc(cluster.id);

            // Enrich tools with history & entity metrics
            const enrichedTools = cluster.tools.map(tool => {
                const launchYear = tool.year || 2023;
                const peak = 10 + (tool.name.length % 5) * 5; // Deterministic random peak (10-35)

                // Entity Metrics (Simulated for V1)
                const importance = Math.round(peak / 3.5); // 1-10 Scale approx
                const consensus = 0.5 + (tool.name.length % 5) * 0.1; // 0.5 - 0.9 Scale

                const history = years.map(year => {
                    let value = 0;
                    if (year >= launchYear) {
                        // Simulation: Logistic Growth
                        const age = year - launchYear;
                        value = peak * (1 / (1 + Math.exp(-age + 2)));
                    }
                    return { year, value };
                });

                return { ...tool, history, importance, consensus };
            });

            batch.set(ref, {
                ...cluster,
                tools: enrichedTools,
                lastSeeded: firebase.firestore.FieldValue.serverTimestamp()
            });
        });

        try {
            await batch.commit();
            console.log("History seeded successfully!");
            window.dispatchEvent(new CustomEvent('manifold-toast', {
                detail: { message: "Historia generada y guardada en Cloud.", type: 'success' }
            }));
        } catch (e) {
            console.error("Error seeding history:", e);
            window.dispatchEvent(new CustomEvent('manifold-toast', {
                detail: { message: "Error al guardar historia.", type: 'error' }
            }));
        }
    },

    // --- TENSOR DATA SYNC (New Model) ---
    seedTensorData: async function () {
        if (!this.db) return;
        const data = window.ManifoldData;
        if (!data || !data.domains) return;

        console.log("Seeding Tensor Model...");
        const batch = this.db.batch();

        // 1. Save Metadata/Config
        const metaRef = this.db.collection('tensor_model').doc('metadata');
        batch.set(metaRef, {
            version: '1.0',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // 2. Save Domains (Sectors)
        const domainsRef = this.db.collection('tensor_model').doc('domains');
        batch.set(domainsRef, { list: data.domains });

        // 3. Save Tools (Entities)
        const toolsRef = this.db.collection('tensor_model').doc('tools');
        batch.set(toolsRef, { list: data.tools });

        // 4. Save Tensor (Weights)
        const tensorRef = this.db.collection('tensor_model').doc('weights');
        batch.set(tensorRef, { list: data.tensor });

        try {
            await batch.commit();
            console.log("Tensor Model synced to cloud!");
            window.dispatchEvent(new CustomEvent('manifold-toast', {
                detail: { message: "Modelo Tensor sincronizado con la nube.", type: 'success' }
            }));
        } catch (e) {
            console.error("Error seeding tensor:", e);
            window.dispatchEvent(new CustomEvent('manifold-toast', {
                detail: { message: "Error al sincronizar modelo.", type: 'error' }
            }));
        }
    },

    getTensorData: async function () {
        if (!this.db) return null; // Return null to fallback to local
        try {
            const docDomains = await this.db.collection('tensor_model').doc('domains').get();
            const docTools = await this.db.collection('tensor_model').doc('tools').get();
            const docTensor = await this.db.collection('tensor_model').doc('weights').get();

            if (docDomains.exists && docTools.exists && docTensor.exists) {
                return {
                    domains: docDomains.data().list,
                    tools: docTools.data().list,
                    tensor: docTensor.data().list
                };
            }
            return null;
        } catch (e) {
            console.warn("Could not fetch tensor data:", e);
            return null;
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
