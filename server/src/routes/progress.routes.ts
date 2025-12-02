import progressController from '@/controllers/progress.controller'
import { Router } from 'express'
import authMiddleware from '@/middleware/auth.middleware'

const router = Router()

router.get('/course/:courseId', authMiddleware.authRequired, progressController.getProgressByCourse)
router.post('/', authMiddleware.authRequired, progressController.updateProgress)

export default router
