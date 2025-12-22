// Firebase Authentication Service
window.ManifoldAuth = {
    auth: null,
    user: null,

    // Configuration Placeholder - User must replace this! ai-manifold.firebaseapp.com
    config: {
        apiKey: "AIzaSyCz1x4_iS37dwbUT7ceJXVw2rTy7Vb8lLc",
        authDomain: "research.unsink.io",
        projectId: "ai-manifold",
        storageBucket: "ai-manifold.appspot.com",
        messagingSenderId: "458242987146",
        appId: "1:458242987146:web:9c5e80950e08f6afb68973"
    },

    init: function () {
        if (!firebase) {
            console.error("Firebase SDK not loaded");
            return;
        }

        // Check if config is still default
        if (this.config.apiKey === "YOUR_API_KEY_HERE") {
            console.warn("Firebase Config is missing. Auth will not work until keys are added in src/services/auth.js");
            return;
        }

        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(this.config);
            }
            this.auth = firebase.auth();
            console.log("Firebase Auth Initialized");
        } catch (e) {
            console.error("Firebase Init Error", e);
        }
    },

    signInWithGoogle: async function () {
        if (!this.auth) {
            alert("Firebase is not configured. Check your console.");
            return;
        }
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await this.auth.signInWithPopup(provider);
            return result.user;
        } catch (error) {
            console.error("Login Failed", error);
            throw error;
        }
    },

    signOut: async function () {
        if (!this.auth) return;
        try {
            await this.auth.signOut();
        } catch (error) {
            console.error("Logout Failed", error);
        }
    },

    // Subscriber
    onAuthStateChanged: function (callback) {
        if (!this.auth) return () => { };
        return this.auth.onAuthStateChanged((user) => {
            this.user = user; // Sync internal state
            callback(user);
        });
    }
};

// Auto-init if feasible (or let App.js do it)
// window.ManifoldAuth.init();
