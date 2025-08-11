import express from 'express';

import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  requestPasswordResetController,
  resetPasswordController,
} from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validateBody.js';

import {
  registerSchema,
  loginSchema,
  requestPasswordResetSchema,
  resetPasswordSchema
} from '../validation/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));
router.post('/refresh', refreshController);
router.post('/logout', logoutController);
router.post('/send-reset-email', validateBody(requestPasswordResetSchema), ctrlWrapper(requestPasswordResetController));
router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));


export default router;
