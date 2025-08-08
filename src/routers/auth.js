import express from 'express';

import { registerController, loginController, refreshController, logoutController } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validateBody.js';

import {
    registerSchema,
    loginSchema,
  } from '../validation/auth.js';

  import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(registerController));
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));
router.post('/refresh', refreshController);
router.post('/logout', logoutController);

export default router;