
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
       type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address'],
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
      },
    createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
      }
})

export const User = mongoose.model('User', userSchema);