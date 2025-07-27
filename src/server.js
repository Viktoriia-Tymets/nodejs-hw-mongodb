import express from 'express';
import cors from 'cors'
import pino from 'pino'
import pinoHttp from 'pino-http'
import dotenv from 'dotenv';
import { initMongoConnection } from './db/initMongoConnection.js';
import contactsRouter from './routers/contacts.js';
import createError from 'http-errors';


dotenv.config();

async function setupServer() {

const app = express();
const logger = pino();

await initMongoConnection();

app.use(pinoHttp({ logger }))
  app.use(cors())
  app.use(express.json())

  app.use('/contacts', contactsRouter);

  app.use((req, res, next) => {
    next(createError(404, 'Route not found'));
  });
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
      status,
      message: err.message || 'Internal Server Error',
    });
  });


const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`🚀 Server is running on port ${PORT}`);
  });
}
  setupServer().catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  })


