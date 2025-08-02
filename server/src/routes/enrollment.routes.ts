import { Router } from 'express'
import enrollmentController from '../controllers/enrollment.controller'
import authMiddleware from '../middleware/auth.middleware'

const router = Router()

router.post('/', authMiddleware.verifyToken, enrollmentController.enrollCourse)
router.get('/', authMiddleware.verifyToken, enrollmentController.getUserEnrollments)
router.get('/check/:courseId', authMiddleware.verifyToken, enrollmentController.checkEnrollment)
router.delete('/:courseId', authMiddleware.verifyToken, enrollmentController.unenrollCourse)

export default router
