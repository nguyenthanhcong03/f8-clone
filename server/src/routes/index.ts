import { Router } from 'express'
import userRoutes from './user.routes'

const router = Router()

// API Routes
router.use('/users', userRoutes)

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running successfully',
    timestamp: new Date().toISOString()
  })
})

export default router
