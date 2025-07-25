import { Router } from 'express'
import authRoutes from './auth.routes'
import userRoutes from './user.routes'
import courseRoutes from './course.routes'

const router = Router()

// API Routes
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/courses', courseRoutes)

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running successfully',
    timestamp: new Date().toISOString()
  })
})

export default router
