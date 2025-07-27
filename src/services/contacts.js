import { Contact } from "../models/contacts.js";

export async function getAllContacts() {
    return await Contact.find()
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