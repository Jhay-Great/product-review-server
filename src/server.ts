import dotenv from 'dotenv'
dotenv.config();

import app from './app';
import mongoDB from './config/db';
import pool, { checkDBServer } from './config/db.pgConfig';


const PORT = process.env.PORT || 9000;

// app.listen(PORT, () => {
//     mongoDB();
//     console.log(`Server is live on port ${PORT}`);
// });

const startServer = async function() {
    try {
        // await mongoDB(); // mongo db server;
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

