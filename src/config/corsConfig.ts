import cors from 'cors';

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

// const corsConfig = cors({});
const corsConfig = cors({
    origin(requestOrigin, callback) {
        console.log('request origin: ', requestOrigin);
        if (!requestOrigin) {
            // console.log('request has no origin', requestOrigin)
            callback(null, true);
        };

        if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
            callback(null, true);
        } else {
            // console.log('else block also runs');
            // callback( new Error('Not allowed by CORS'))
        }
    }
});

export default corsConfig;