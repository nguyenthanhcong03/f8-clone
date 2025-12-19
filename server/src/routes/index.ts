import { Router } from 'express'
import authRoutes from './auth.routes'
import userRoutes from './user.routes'
import courseRoutes from './course.routes'
import sectionRoutes from './section.routes'
import lessonRoutes from './lesson.routes'
import enrollmentRoutes from './enrollment.routes'
import progressRoutes from './progress.routes'
import blogRoutes from './blog.routes'

const router = Router()

// API Routes
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/courses', courseRoutes)
router.use('/sections', sectionRoutes)
router.use('/lessons', lessonRoutes)
router.use('/enrollments', enrollmentRoutes)
router.use('/progress', progressRoutes)
router.use('/blogs', blogRoutes)

export default router
