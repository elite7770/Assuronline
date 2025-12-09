import { Router } from 'express';
import { register, login, me } from '../../core/application/auth.controller.js';
import { z } from 'zod';
import { validate } from '../../shared/validate.js';
import { authMiddleware } from '../../shared/auth.js';

const router = Router();

const registerSchema = {
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
};

const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
};

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authMiddleware, me);

export default router;
