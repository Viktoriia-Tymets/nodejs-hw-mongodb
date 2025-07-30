import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from "../services/contacts.js";
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import createError from 'http-errors';

export async function handleGetAllContacts(req, res, next) {
    try {
      const { page, perPage } = parsePaginationParams(req.query);
      const { sortBy, sortOrder } = parseSortParams(req.query);
  
      console.log('handleGetAllContacts params:', { page, perPage, sortBy, sortOrder });
  
      const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder });
  
      res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      next(createError(500, error.message));
    }
  }

export async function handleGetAllContactsById(req, res, next) {
    const {contactId} = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
        throw createError(404, 'Contact not found');
      }

    res.json({
        status: 200,
        message: `Successfully found contact ${contactId}`,
        data: contact,
    });
}

export async function handleCreateContact(req, res) {
    const contact = await createContact(req.body);
    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contact,
    })
    
}

export async function handleUpdateContact(req, res) {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);

    if(!result) {
        throw createError(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: result
    })
}

export async function handleDeleteContact(req, res) {
    const { contactId } = req.params;
    const result = await deleteContact(contactId);

    if(!result) {
        throw createError(404, 'Contact not found');
    }

    res.status(204).send();
    
}