import { Contact } from "../models/contacts.js";

export async function getAllContacts({ page, perPage, sortBy, sortOrder }) {
    console.log('getAllContacts params:', { page, perPage, sortBy, sortOrder });
  
    const skip = (page - 1) * perPage;
    const sortDirection = sortOrder === 'desc' ? -1 : 1;
  
    const [contacts, totalItems] = await Promise.all([
      Contact.find()
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(perPage),
      Contact.countDocuments(),
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



export async function getContactById(contactId) {
   return await Contact.findById(contactId) 
}

export async function createContact(payload) {
    return Contact.create(payload);
}

export async function updateContact(contactId, payload) {
    return Contact.findByIdAndUpdate(contactId, payload, {new: true})
}

export async function deleteContact(contactId) {
    return Contact.findByIdAndDelete(contactId);
}