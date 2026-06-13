import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT || '5432'),
});

export const checkDBServer = async function () {
    try {
        await pool.query('SELECT 1');
        // eslint-disable-next-line no-console
        console.log('db is live');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('db connection failed:', error);
        throw error;
    }
};

export default pool;
