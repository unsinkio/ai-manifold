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
    }
};
