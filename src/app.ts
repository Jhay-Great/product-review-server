import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import router from './routes';
import corsConfig from './config/corsConfig';

const app = express();

app.use(corsConfig);
// app.use(cors({
//     origin: 'http://localhost:4200',
// }));

app.use(express.json());

app.use(morgan('dev'));

app.use('/api/v1/', router);
app.use((err:Error, req:Request, res:Response, next:NextFunction) => {
    if (err.message === 'Not allowed by CORS') {
        res.status(403).json({ error: 'CORS Error: Origin not allowed' });
        return;
    };
    
    res.status(500).json({
        message: 'Server error',
    })
});
// app.use((err, req, res, next) => {
//   if (err.message === 'Not allowed by CORS') {
//     return res.status(403).json({ error: 'CORS Error: Origin not allowed' });
//   }
//   next(err);
// });

export default app;
