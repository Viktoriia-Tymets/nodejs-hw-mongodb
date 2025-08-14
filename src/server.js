import express from 'express';
import cors from 'cors'
import pino from 'pino'
import pinoHttp from 'pino-http'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { initMongoConnection } from './db/initMongoConnection.js';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import userRouter from "./routers/auth.js";
import { getEnvVariable } from './utils/getEnvVariable.js';


dotenv.config();

async function setupServer() {

const app = express();
const logger = pino();

await initMongoConnection();

app.use(pinoHttp({ logger }))
  app.use(cors())
  app.use(express.json())
  app.use(cookieParser());
  app.use('/avatars', express.static('src/uploads/avatars'));

  app.use('/contacts', contactsRouter);
  app.use('/auth', userRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);


const PORT = getEnvVariable('PORT') || 3000;
  app.listen(PORT, () => {
    logger.info(`🚀 Server is running on port ${PORT}`);
  });
}
  setupServer().catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  })


