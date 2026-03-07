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

// single catch-all for unmatched routes — forward a NotFoundError to the global handler
app.use((req:Request, res:Response, next:NextFunction) => {
    next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
});

// global error handling
app.use(errorHandler)

export default app;
