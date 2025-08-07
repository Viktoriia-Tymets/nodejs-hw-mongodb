import { registerUser, loginUser, refreshSession, logoutUser } from "../services/auth.js";
import createHttpError from 'http-errors';

export async function registerController(req, res) {
    const user = await registerUser(req.body);
    const {password, ...userWithoutPassword } = user.toObject();
  
    res.status(201).json({
        message: "Successfully registered a user!",
        data: userWithoutPassword,
      });
  }


  export async function loginController(req, res) {
    const session = await loginUser(req.body.email, req.body.password);
  
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });
  
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });
  
    res.json({
      status: 200,
      message: "Successfully logged in an user!",
      data: {
        accessToken: session.accessToken,
      },
    });
  }


  export async function refreshController(req, res) {
    const { sessionId, refreshToken } = req.cookies;
    if (!sessionId || !refreshToken) {
        throw createHttpError(401, 'No session or refresh token');
      }
  
    const session = await refreshSession(sessionId, refreshToken);
  
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });
  
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });
  
    res.json({
      status: 200,
      message: "Successfully refreshed a session!",
      data: {
        accessToken: session.accessToken,
      },
    });
  }


  export async function logoutController(req, res) {
    const { sessionId } = req.cookies;

    if (!sessionId) {
        throw createHttpError(401, 'No session to logout');
      }
      await logoutUser(sessionId);
  
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');
  
    res.status(204).end();
  }
  