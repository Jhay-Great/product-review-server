import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

import router from './routes';
import corsConfig from './config/corsConfig';

const app = express();

app.use(corsConfig);

app.use(express.json());

app.use(morgan('dev'));

app.use('/api/v1/', router);
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        status: 404,
        message: 'Resource not found',
    })
}) 
app.use((err:Error, req:Request, res:Response, next:NextFunction) => {
    if (err.message === 'Not allowed by CORS') {
        res.status(403).json({ error: 'CORS Error: Origin not allowed' });
        return;
    };
    
    res.status(500).json({
        message: 'Server error',
    })
});

export default app;
