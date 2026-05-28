import express from 'express'
import cors    from 'cors'
import helmet  from 'helmet'
import morgan  from 'morgan'

import authRoutes    from './routes/auth.js'
import productRoutes from './routes/products.js'
import orderRoutes   from './routes/orders.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

// Security headers
app.use(helmet())

// CORS — allow your Vite dev server
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

// Request logging
app.use(morgan('dev'))

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, project: 'Frames API', version: '1.0.0' })
})

// Routes
app.use('/api/auth',     authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders',   orderRoutes)

// Global error handler — must be last
app.use(errorHandler)

export default app