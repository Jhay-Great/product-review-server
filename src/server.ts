import dotenv from 'dotenv'
dotenv.config();

const requiredEnv = ['JWT_SECRET', 'PG_HOST', 'PG_DATABASE', 'PG_USER', 'PG_PASSWORD'];
for (const key of requiredEnv) {
    if (!process.env[key]) {
        console.error(`Missing required environment variable: ${key}`);
        process.exit(1);
    }
}

import app from './app';
import pool, { checkDBServer } from './config/database';


const PORT = process.env.PORT || 9000;

const startServer = async function() {
    try {
        await checkDBServer(); // postgres db server;
        app.listen(PORT, () => {
            console.log(`Server is live on port ${PORT}`)
        })

    } catch (error) {
        console.log('Failed to start server: ', error);
        process.exit(1);
    }
}

startServer();
