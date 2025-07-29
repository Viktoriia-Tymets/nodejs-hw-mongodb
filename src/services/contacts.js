import { Contact } from "../models/contacts.js";

export async function getAllContacts({page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc'}) {
    const totalItems = await Contact.countDocuments();
    const totalPages = Math.ceil(totalItems / perPage);
    const skip = (page - 1) * perPage;
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 }
  
    const contacts = await Contact.find()
    .sort(sort)
      .skip(skip)
      .limit(perPage);
  
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