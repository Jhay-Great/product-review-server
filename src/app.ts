import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

import router from './routes';
import corsConfig from './config/corsConfig';
import { errorHandler } from './middleware/errorHandler';
import { NotFoundError } from './utils/errors/httpErrors';

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
    next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
});
app.use(errorHandler)

export default app;
