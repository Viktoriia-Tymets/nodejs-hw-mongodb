import express from 'express';

import { registerController, loginController, refreshController, logoutController } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validateBody';

import {
    registerSchema,
    loginSchema,
  } from '../validation/auth.js';

  import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post(
    '/register',
    validateBody(registerSchema),
    ctrlWrapper(registerController),
  );

  router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));

  router.post('/refresh', ctrlWrapper(refreshController));
  router.post('/logout', ctrlWrapper(logoutController));

export default router;