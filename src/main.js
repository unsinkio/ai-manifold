const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
const App = window.App;

if (App) {
    root.render(<App />);
    if (window.removeLoader) window.removeLoader();
} else {
    console.error("App component is not defined. Check App.js loading order.");
}
