import express from 'express';

import {
    handleGetAllContacts,
    handleGetAllContactsById,
    handleCreateContact,
    handleUpdateContact,
    handleDeleteContact

} from '../controllers/contacts.controllers.js'
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactsSchema, updateContactSchema } from '../validation/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
const router = express.Router();

router.get('/', ctrlWrapper(handleGetAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(handleGetAllContactsById));
router.post('/', validateBody(contactsSchema), ctrlWrapper(handleCreateContact));
router.patch('/:contactId', validateBody(updateContactSchema), isValidId, ctrlWrapper(handleUpdateContact));
router.delete('/:contactId', isValidId, ctrlWrapper(handleDeleteContact))

export default router;