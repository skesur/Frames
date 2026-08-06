import { Router } from 'express'
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/paymentController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/create-order', protect, createRazorpayOrder)
router.post('/verify', protect, verifyRazorpayPayment)

export default router
