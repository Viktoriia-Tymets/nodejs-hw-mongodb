import mongoose from "mongoose";

const contactsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})