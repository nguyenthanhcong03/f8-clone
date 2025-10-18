import { Router } from 'express'
import enrollmentController from '../controllers/enrollment.controller'
import authMiddleware from '../middleware/auth.middleware'

const router = Router()

router.post('/', authMiddleware.authRequired, enrollmentController.enrollCourse)
router.get('/', authMiddleware.authRequired, enrollmentController.getUserEnrollments)
router.get('/check/:courseId', authMiddleware.authRequired, enrollmentController.checkEnrollment)
router.delete('/:courseId', authMiddleware.authRequired, enrollmentController.unenrollCourse)

export default router
