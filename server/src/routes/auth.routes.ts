import { Router } from 'express'
import { validate } from '../middleware/validation.middleware'
import { changePasswordSchema } from '../schemas/auth.schema'
import authController from '@/controllers/auth.controller'

const router = Router()

// POST /auth/register - Register a new account
router.post('/register', authController.registerAccount)
// POST /auth/login - Login to an account
router.post('/login', authController.loginAccount)
// PUT /users/:id/password - Change password
router.put('/:id/password', validate(changePasswordSchema), authController.changePassword)

export default router
