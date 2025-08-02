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
// POST /auth/logout - Logout from the account
router.post('/logout', authController.logout)
// POST /auth/refresh-token - Refresh access token
router.post('/refresh-token', authController.refreshToken)

export default router
