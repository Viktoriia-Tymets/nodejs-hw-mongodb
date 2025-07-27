import express from 'express';

import {
    handleGetAllContacts,
    handleGetAllContactsById,
    handleCreateContact,
    handleUpdateContact,
    handleDeleteContact

} from '../controllers/contacts.controllers.js'
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(handleGetAllContacts));
router.get('/:contactId', ctrlWrapper(handleGetAllContactsById));
router.post('/',ctrlWrapper(handleCreateContact));
router.patch('/:contactId', ctrlWrapper(handleUpdateContact));
router.delete('/:contactId', ctrlWrapper(handleDeleteContact))

export default router;