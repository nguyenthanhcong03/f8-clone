import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import sequelize from './config/database'
import routes from './routes'
import { errorConverter, errorHandler, notFound } from '@/middleware/error.middleware'

// Import models to set up associations
import './models/index'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet()) // Security headers
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(morgan('combined')) // Logging
app.use(cookieParser()) // Parse cookies
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Routes
app.use('/api/v1', routes)

// Error handling middleware
app.use(notFound)
app.use(errorConverter)
app.use(errorHandler)

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate()
    console.log('Database connected successfully')

    // Sync database (creates tables if they don't exist)
    await sequelize.sync() // hoặc sync({ force: true }) nếu muốn reset DB
    console.log('Database synchronized')

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('Unable to start server:', error)
    process.exit(1)
  }
}

startServer()
