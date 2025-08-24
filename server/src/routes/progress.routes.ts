import progressController from '@/controllers/progress.controller'
import { Router } from 'express'
import authMiddleware from '@/middleware/auth.middleware'

const router = Router()

router.post('/', authMiddleware.verifyToken, progressController.updateProgress)

export default router
