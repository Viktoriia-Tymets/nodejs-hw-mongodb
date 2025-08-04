import createHttpError from 'http-errors';


import { User } from '../models/user.js';
import { Session } from '../models/session.js';

export async function authenticate(req, res, next) {
    try {
      const { authorization } = req.headers;
  
      if (typeof authorization !== 'string') {
        throw createHttpError(401, 'Please provide access token');
      }
  
      const [bearer, accessToken] = authorization.split(' ', 2);
  
      if (bearer !== 'Bearer' || !accessToken) {
        throw createHttpError(401, 'Please provide access token');
      }
  
      const session = await Session.findOne({ accessToken });
  
      if (!session) {
        throw createHttpError(401, 'Session not found');
      }
  
      if (session.accessTokenValidUntil < new Date()) {
        throw createHttpError(401, 'Access token expired');
      }
  
      const user = await User.findById(session.userId);
  
      if (!user) {
        throw createHttpError(401, 'User not found');
      }
  
      req.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
  
      next();
    } catch (error) {
      next(error);
    }
  }