import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from "jsonwebtoken";

import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import sendEmail from '../utils/sendMail.js'

const JWT_SECRET = process.env.JWT_SECRET;
const APP_DOMAIN = process.env.APP_DOMAIN;

export async function registerUser(payload) {
    const user = await User.findOne({ email: payload.email });
  
    if (user !== null) {
      throw createHttpError(409, 'Email in use');
    }
  
    payload.password = await bcrypt.hash(payload.password, 10);
  
    return User.create(payload);
  }


  export async function loginUser(email, password) {
    const user = await User.findOne({ email });
  
    if (user === null) {
      throw createHttpError(401, 'Email or password is incorrect');
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (isMatch !== true) {
      throw createHttpError(401, 'Email or password is incorrect');
    }
  
    await Session.deleteOne({ userId: user._id });
  
    return Session.create({
      userId: user._id,
      accessToken: crypto.randomBytes(30).toString('base64'),
      refreshToken: crypto.randomBytes(30).toString('base64'),
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }

  export async function refreshSession(sessionId, refreshToken) {
    const session = await Session.findById(sessionId);
  
    if (session === null) {
      throw createHttpError.Unauthorized('Session not found');
    }
  
    if (session.refreshToken !== refreshToken) {
      throw createHttpError.Unauthorized('Refresh token is invalid');
    }
  
    if (session.refreshTokenValidUntil < new Date()) {
      throw createHttpError.Unauthorized('Refresh token is expired');
    }
  
    await Session.deleteOne({ _id: session._id });
  
    return Session.create({
      userId: session.userId,
      accessToken: crypto.randomBytes(30).toString('base64'),
      refreshToken: crypto.randomBytes(30).toString('base64'),
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 60 * 60 * 1000),
    });
  }

  export async function logoutUser(sessionId) {
    const session = await Session.findByIdAndDelete(sessionId);
    if (!session) {
      console.warn(`Session ${sessionId} not found`);
    } else {
      console.log(`Session ${sessionId} deleted`);
    }
  }
  export async function requestPasswordReset(email) {
    const user = await User.findOne({ email });
  
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }
  
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
  
    const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;
  
    const subject = 'Reset your password';
    const html = `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 5 minutes.</p>
    `;
  
    try {
      await sendEmail({
        to: email,
        subject,
        html
      });
    } catch (error) {
      throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
  }
  

  export async function resetPassword(token, newPassword) {
    let email;
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      email = decoded.email;
    } catch (eror) {
      throw createHttpError(401, "Token is expired or invalid.");
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, "User not found!");
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  
    await Session.deleteMany({ userId: user._id });
  }