import authController from '@/controllers/auth.controller'
import authMiddleware from '@/middleware/auth.middleware'
import upload from '@/middleware/upload.middleware'
import { Router } from 'express'
import { validate } from '../middleware/validation.middleware'
import { changePasswordSchema } from '../schemas/auth.schema'

const router = Router()

router.post('/register', authController.registerAccount)
router.post('/login', authController.loginAccount)
router.put('/:id/password', validate(changePasswordSchema), authController.changePassword)
router.post('/logout', authController.logout)
router.post('/refresh-token', authController.refreshToken)
router.get('/me', authMiddleware.authRequired, authController.getCurrentUser)
router.get('/profile', authMiddleware.authRequired, authController.getProfile)
router.put('/profile', authMiddleware.authRequired, upload.single('avatar'), authController.updateProfile)
router.get('/public-profile/:username', authController.getPublicProfileByUsername)

export default router
