const App = require('./presentation/http/app');

async function startServer() {
    try {
        const app = await new App().init();
        app.listen();
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
