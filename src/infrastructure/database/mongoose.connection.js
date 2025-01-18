const mongoose = require('mongoose');
const { envConfig } = require('../../config');

class DatabaseConnection {
    constructor() {
        this.uri = envConfig.db.uri;
    }

    async connect() {
        try {
            await mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Successfully connected to MongoDB.');
            this._setupEventHandlers();
        } catch (error) {
            console.error('MongoDB connection error:', error);
            process.exit(1);
        }
    }

    _setupEventHandlers() {
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected!');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            process.exit(0);
        });
    }
}

module.exports = new DatabaseConnection();
