import cors from 'cors';

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

const corsConfig = cors({
    origin(requestOrigin, callback) {
        if (!requestOrigin) {
            callback(null, true);
        } else if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
            callback(null, true);
        } else {
            callback( new Error('Not allowed by CORS'))
        }
    }
});

export default corsConfig;