import express, { Response, Request, NextFunction } from 'express';
import 'dotenv/config';
import 'express-async-errors';
import routes from '@shared/infra/http/routes';
import 'reflect-metadata';
import '@shared/infra/typeorm';
import '@shared/container';
import AppError from '@shared/errors/AppErro';
import { errors } from 'celebrate';
import cors from 'cors';

import multerConfig from '@config/multer';
import rateLimiter from './middlewares/rateLimiter';

const app = express();
app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use('/files', express.static(multerConfig.uploadsFolder));
app.use(routes);
app.use(errors());
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  console.error(err);

  return response
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});
app.listen(3333, () => {
  console.log('🚀 server running on port 3333');
});
