// Login Screen Component
const Auth = window.ManifoldAuth;

window.LoginScreen = function LoginScreen({ onLoginSuccess, onSkip }) {
    const handleGoogleLogin = async () => {
        try {
            if (Auth.config.apiKey === "YOUR_API_KEY_HERE") {
                alert("¡FALTA CONFIGURACION! Abre src/services/auth.js y coloca tus llaves de Firebase.");
                return;
            }

            const user = await Auth.signInWithGoogle();
            if (user) {
                onLoginSuccess(user);
            }
        } catch (error) {
            console.error("Login component error", error);
            alert("Error al iniciar sesión: " + error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#050712] z-50 flex items-center justify-center animate-fadeIn">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a2440] to-[#050712] z-0" />

            <div className="relative z-10 p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl max-w-md w-full text-center shadow-2xl">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
                    Manifold de IA
                </h1>
                <p className="text-gray-400 mb-8 text-sm">
                    Descubre, evalúa y conecta herramientas de Inteligencia Artificial para tu sector.
                </p>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-all mb-4"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Continuar con Google
                </button>

                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-700"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-xs">O</span>
                    <div className="flex-grow border-t border-gray-700"></div>
                </div>

                <button
                    onClick={onSkip}
                    className="text-gray-500 hover:text-white text-sm transition-colors"
                >
                    Continuar como Invitado (Sin guardar en la nube)
                </button>

                <p className="mt-8 text-xs text-gray-600">
                    Al continuar, aceptas nuestros términos de servicio y política de privacidad.
                    <br />Esta es una versión Alpha v0.2.
                </p>
            </div>
        </div>
    );
};
