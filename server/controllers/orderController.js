import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import mongoose from 'mongoose'
import { AppError } from '../middleware/errorHandler.js'
import Notification from '../models/Notification.js'
import { startOrderStatusAutomation } from '../services/orderAutomationService.js'

const LENS_COATINGS = ['standard', 'none', 'anti-glare', 'blue-light', 'photochromic']
const LENS_TYPES = ['zero-power', 'power']
const DELIVERY_METHODS = ['free', 'standard', 'express', 'overnight']
const PAYMENT_METHODS = ['cod', 'card', 'upi', 'netbanking']

async function validateOrderPayload(body) {
  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new AppError('Order must include at least one item', 400)
  }

  if (body.items.length > 50) {
    throw new AppError('Order cannot contain more than 50 different products', 400)
  }

  for (const item of body.items) {
    if (!mongoose.isValidObjectId(item.product)) {
      throw new AppError('Order item contains an invalid product id', 400)
    }

    const quantity = Number(item.quantity)
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new AppError('Order item quantity must be between 1 and 99', 400)
    }

    if (typeof item.name !== 'string' || item.name.trim().length === 0) {
      throw new AppError('Order item name is required', 400)
    }

    if (typeof item.price !== 'number' || item.price < 0) {
      throw new AppError('Order item price must be a valid number', 400)
    }
  }

  const productIds = body.items.map((item) => item.product)
  const products = await Product.find({ _id: { $in: productIds } })
  const productMap = new Map(products.map((p) => [String(p._id), p]))

  if (products.length !== new Set(productIds.map(String)).size) {
    throw new AppError('Order contains a product that does not exist', 400)
  }

  for (const item of body.items) {
    const dbProduct = productMap.get(String(item.product))
    if (!dbProduct) {
      throw new AppError(`Product "${item.name}" not found`, 400)
    }
    const reqQty = Number(item.quantity)
    if (!dbProduct.inStock || dbProduct.stock <= 0) {
      throw new AppError(`"${dbProduct.name}" is currently out of stock.`, 400)
    }
    if (dbProduct.stock < reqQty) {
      throw new AppError(
        `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stock} frame${dbProduct.stock === 1 ? '' : 's'} left in stock.`,
        400
      )
    }
  }

  if (!LENS_COATINGS.includes(body.lensCoating)) {
    throw new AppError('Invalid lens coating selected', 400)
  }

  if (!body.prescription || !LENS_TYPES.includes(body.prescription.lensType)) {
    throw new AppError('Invalid lens type selected', 400)
  }

  if (!body.delivery || !DELIVERY_METHODS.includes(body.delivery.method)) {
    throw new AppError('Invalid delivery method selected', 400)
  }

  if (!/^\d{6}$/.test(body.delivery.pincode || '')) {
    throw new AppError('Delivery pincode must be exactly 6 digits', 400)
  }

  if (!/^\d{10}$/.test(body.delivery.phone || '')) {
    throw new AppError('Delivery phone number must be exactly 10 digits', 400)
  }

  if (typeof body.delivery.address !== 'string' || body.delivery.address.trim().length < 8) {
    throw new AppError('Delivery address must be at least 8 characters', 400)
  }

  if (!PAYMENT_METHODS.includes(body.paymentMethod)) {
    throw new AppError('Invalid payment method selected', 400)
  }

  if (!body.pricing || typeof body.pricing.total !== 'number' || body.pricing.total < 0) {
    throw new AppError('Order pricing is invalid', 400)
  }
}

export const createOrder = async (req, res, next) => {
  try {
    await validateOrderPayload(req.body)

    // Decrement stock for ordered items
    for (const item of req.body.items) {
      const p = await Product.findById(item.product)
      if (p) {
        p.stock = Math.max(0, p.stock - Number(item.quantity))
        p.inStock = p.stock > 0
        await p.save()
      }
    }

    const paymentStatus = req.body.pricing.total === 0 ? 'paid' : 'pending'

    const order = await Order.create({
      ...req.body,
      user: req.user.id,
      paymentStatus
    })
    
    // Start automated background order status transitions
    startOrderStatusAutomation(order._id, order.paymentMethod)
    
    // Create in-app success notification for the user
    Notification.create({
      user: req.user.id,
      type: 'general',
      title: 'Order Placed Successfully! 🛒',
      message: `Your order "${order.orderId}" has been placed successfully for a total of ₹${order.pricing.total.toLocaleString('en-IN')}. We are on it!`,
      link: `/profile?order=${order._id}`,
    }).catch((err) => {
      console.error('[Order Controller] Failed to create order placement notification:', err.message)
    })

    res.status(201).json({ success: true, order })
  } catch (err) {
    next(err)
  }
}

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images price')
    res.json({ success: true, orders })
  } catch (err) {
    next(err)
  }
}

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
    res.json({ success: true, order })
  } catch (err) {
    next(err)
  }
}
