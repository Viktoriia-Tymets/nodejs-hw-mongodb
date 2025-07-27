import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from "../services/contacts.js";
import createError from 'http-errors';

export async function handleGetAllContacts(req, res) {
    const contacts = await getAllContacts();
    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
    
}

export async function handleGetAllContactsById(req, res, next) {
try{
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
} catch (error) {
    next(error)
}
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
    const result = await updateContact(req.params.id, req.body);

    if(result === null) {
        throw new createError.NotFound(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: result
    })
}

export async function handleDeleteContact(req, res) {
    const result = await deleteContact(req.params.id);

    if(result === null) {
        throw new createError.NotFound(404, 'Contact not found');
    }

    res.json({
        status:204
    })
    
}