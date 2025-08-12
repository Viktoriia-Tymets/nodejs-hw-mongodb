import fs from 'fs/promises';
import path from 'node:path';

import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from "../services/contacts.js";
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import createError from 'http-errors';
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { getEnvVariable } from '../utils/getEnvVariable.js';

export async function handleGetAllContacts(req, res, next) {
    try {
      const { page, perPage } = parsePaginationParams(req.query);
      const { sortBy, sortOrder } = parseSortParams(req.query);
  
      console.log('handleGetAllContacts params:', { page, perPage, sortBy, sortOrder });
  
      const contacts = await getAllContacts(req.user._id, { page, perPage, sortBy, sortOrder });
  
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
    const updates = req.body;
    if (req.file) {
      updates.photo = req.file.path;
    }
    const contact = await getContactById(contactId, req.user._id);

    if (!contact) {
        throw createError(404, 'Contact not found');
      }

    res.json({
        status: 200,
        message: `Successfully found contact ${contactId}`,
        data: contact,
    });
}

export async function handleCreateContact(req, res, next) {
  try {
    let photoUrl = null;

    if (req.file) {
      if (getEnvVariable('UPLOAD_TO_CLOUDINARY') === 'true') {
        const result = await uploadToCloudinary(req.file.path);
        await fs.unlink(req.file.path);
        photoUrl = result.secure_url;
      } else {
        await fs.rename(
          req.file.path,
          path.resolve('src/uploads/avatars', req.file.filename)
        );
        photoUrl = `http://localhost:3000/avatars/${req.file.filename}`;
      }
    }

    const contact = await createContact({ ...req.body, photo: photoUrl }, req.user._id);

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contact,
    })
  } catch (error) {
    next(error);
}
}

export async function handleUpdateContact(req, res, next) {
  try{
    const { contactId } = req.params;
    const updates = { ...req.body };

    if (req.file) {
      if (getEnvVariable('UPLOAD_TO_CLOUDINARY') === 'true') {
        const result = await uploadToCloudinary(req.file.path);
        await fs.unlink(req.file.path);
        updates.photo = result.secure_url;
      } else {
        await fs.rename(
          req.file.path,
          path.resolve('src/uploads/avatars', req.file.filename)
        );
        updates.photo = `http://localhost:3000/avatars/${req.file.filename}`;
      }
    }

    const updated = await updateContact(contactId, updates, req.user._id);

    if (!updated) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: updated
    })
   } catch (err) {
  next(err);
}
}


export async function handleDeleteContact(req, res) {
    const { contactId } = req.params;
    const result = await deleteContact(contactId, req.user._id);

    if(!result) {
        throw createError(404, 'Contact not found');
    }

    res.status(204).send();
    
}