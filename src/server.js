import express from 'express';
import cors from 'cors'
import pino from 'pino'
import pinoHttp from 'pino-http'
import dotenv from 'dotenv';
import { initMongoConnection } from './db/initMongoConnection.js';
import { getAllContacts, getContactById } from './services/contacts.js';


dotenv.config();

async function setupServer() {
console.log('mongodb connected')

const app = express();
const logger = pino();

await initMongoConnection();

app.use(pinoHttp({ logger }))
  app.use(cors())
  app.use(express.json())

app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();

res.json({
    status: 200,
  message: "Successfully found contacts!",
  data: contacts,
});
});


app.get('/contacts/:contactId', async (req, res) => {
  const { contactId } = req.params
    const contact = await getContactById(contactId);
    if (contact === null) {
        return res
          .status(404)
          .json({ status: 404, message: 'Contact not found', data: null });
      }

      res.json({
        status: 200,
	message: "Successfully found contact with id {contactId}!",
	data: contact
      });
});

app.use((req, res) => {
    res.status(404).json({ status: 404, message: 'Contact not found' });
  });

  setupServer().catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  })}

  setupServer();
