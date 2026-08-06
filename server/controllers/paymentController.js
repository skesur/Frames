import crypto from 'crypto'
import { razorpayInstance } from '../config/razorpay.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import { AppError } from '../middleware/errorHandler.js'
import { sendOrderReceiptEmail } from '../services/emailService.js'
import { startOrderStatusAutomation } from '../services/orderAutomationService.js'

// Create a Razorpay Order ID for the given cart total
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body

    if (typeof amount !== 'number' || amount <= 0) {
      throw new AppError('Invalid payment amount provided', 400)
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new AppError('Razorpay credentials are not configured on the server', 500)
    }

    // Convert amount in Rupees to Paise (Razorpay expects smallest currency unit)
    const amountInPaise = Math.round(amount * 100)

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now().toString().slice(-8)}_${Math.floor(Math.random() * 1000)}`,
    }

    const order = await razorpayInstance.orders.create(options)

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    next(err)
  }
}

// Verify payment signature & finalize order creation
export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderPayload } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new AppError('Missing required payment signature details', 400)
    }

    if (!orderPayload || !Array.isArray(orderPayload.items)) {
      throw new AppError('Invalid order details provided', 400)
    }

    // Generate expected signature using HMAC-SHA256 algorithm
    const signBody = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(signBody)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      throw new AppError('Payment signature verification failed. Transaction flagged as invalid.', 400)
    }

    // Decrement product stock
    for (const item of orderPayload.items) {
      const p = await Product.findById(item.product)
      if (p) {
        p.stock = Math.max(0, p.stock - Number(item.quantity))
        p.inStock = p.stock > 0
        await p.save()
      }
    }

    // Create the finalized Order document in database
    const order = await Order.create({
      user: req.user.id,
      ...orderPayload,
      paymentStatus: 'paid',
      paymentDetails: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
    })

    // Start automated background order status transitions
    startOrderStatusAutomation(order._id, order.paymentMethod)

    // Send order receipt email (non-blocking)
    User.findById(req.user.id)
      .then((user) => {
        if (user) {
          sendOrderReceiptEmail(user, order)
        }
      })
      .catch((emailErr) => {
        console.error('[Payment Controller] Failed to send receipt email:', emailErr)
      })

    res.status(201).json({
      success: true,
      message: 'Payment verified successfully and order placed!',
      order,
    })
  } catch (err) {
    next(err)
  }
}
