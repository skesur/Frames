import express from 'express'
import cors    from 'cors'
import helmet  from 'helmet'
import morgan  from 'morgan'
import mongoose from 'mongoose'

import authRoutes    from './routes/auth.js'
import productRoutes from './routes/products.js'
import orderRoutes   from './routes/orders.js'
import cartRoutes    from './routes/cart.js'
import contactRoutes from './routes/contact.js'
import adminRoutes from './routes/admin.js'
import { AppError, errorHandler } from './middleware/errorHandler.js'

const app = express()

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
]

const envAllowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])]

// Security headers
app.use(helmet())

// CORS: allow local Vite dev origins and optional comma-separated CLIENT_URL values.
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error(`CORS blocked origin: ${origin}`))
  },
  credentials: true,
}))

// Request logging
app.use(morgan('dev'))

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    project: 'Frames API',
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
})

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState === 1) {
    return next()
  }

  return next(new AppError(
    'Database unavailable. Check MongoDB Atlas Network Access and allow your current IP address.',
    503
  ))
}

// Routes
app.use('/api/auth',     requireDatabase, authRoutes)
app.use('/api/products', requireDatabase, productRoutes)
app.use('/api/orders',   requireDatabase, orderRoutes)
app.use('/api/cart',     requireDatabase, cartRoutes)
app.use('/api/contact',  requireDatabase, contactRoutes)
app.use('/api/admin', requireDatabase, adminRoutes)

// Global error handler — must be last
app.use(errorHandler)

export default app

