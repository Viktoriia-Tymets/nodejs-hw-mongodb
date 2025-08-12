import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { uploadFile } from '../middlewares/uploadFile.js';

import {
  handleGetAllContacts,
  handleGetAllContactsById,
  handleCreateContact,
  handleUpdateContact,
  handleDeleteContact,
} from '../controllers/contacts.controllers.js';
import isValidId from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactsSchema, updateContactSchema } from '../validation/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
const router = express.Router();
router.use(authenticate);

router.get('/', ctrlWrapper(handleGetAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(handleGetAllContactsById));
router.post(
  '/',
  uploadFile.single('photo'),
  validateBody(contactsSchema),
  ctrlWrapper(handleCreateContact),
);
router.patch(
  '/:contactId',
  uploadFile.single('photo'),
  validateBody(updateContactSchema),
  isValidId,
  ctrlWrapper(handleUpdateContact),
);
router.delete('/:contactId', isValidId, ctrlWrapper(handleDeleteContact));

export default router;
