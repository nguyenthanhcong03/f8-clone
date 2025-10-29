import { Router } from 'express'
import { validate } from '../middleware/validation.middleware'
import { changePasswordSchema } from '../schemas/auth.schema'
import authController from '@/controllers/auth.controller'
import authMiddleware from '@/middleware/auth.middleware'

const router = Router()

router.post('/register', authController.registerAccount)
router.post('/login', authController.loginAccount)
router.put('/:id/password', validate(changePasswordSchema), authController.changePassword)
router.post('/logout', authController.logout)
router.post('/refresh-token', authController.refreshToken)
router.get('/me', authMiddleware.authRequired, authController.getCurrentUser)
router.get('/profile', authMiddleware.authRequired, authController.getProfile)
router.put('/profile', authMiddleware.authRequired, authController.updateProfile)

export default router
