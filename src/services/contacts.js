import { Contact } from "../models/contacts.js";
import createHttpError from 'http-errors';

export async function getAllContacts(userId, { page, perPage, sortBy, sortOrder }) {
    console.log('getAllContacts params:', { page, perPage, sortBy, sortOrder });
  
    const skip = (page - 1) * perPage;
    const sortDirection = sortOrder === 'desc' ? -1 : 1;
  
    const [contacts, totalItems] = await Promise.all([
      Contact.find({userId})
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(perPage),
      Contact.countDocuments({userId}),
    ]);
  
    console.log('contacts.length:', contacts.length);
  
    const totalPages = Math.ceil(totalItems / perPage);
  
    return {
      data: contacts,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }



export async function getContactById(contactId, userId) {
    const contact = await Contact.findOne({ _id: contactId, userId });

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
  
    return contact; 
}

export async function createContact(payload, userId) {
    return Contact.create({ ...payload, userId });
}

export async function updateContact(contactId, payload, userId) {
    const updated = await Contact.findOneAndUpdate(
        { _id: contactId, userId },
        payload,
        { new: true }
      );
    
      if (!updated) {
        throw createHttpError(404, 'Contact not found');
      }
    
      return updated;
}

export async function deleteContact(contactId, userId) {
    const deleted = await Contact.findOneAndDelete({ _id: contactId, userId });

    if (!deleted) {
      throw createHttpError(404, 'Contact not found');
    }
  
    return deleted;
}