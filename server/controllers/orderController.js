import Order from '../models/Order.js'

export const createOrder = async (req, res, next) => {
  try {
    const order = await Order.create({ user: req.user.id, ...req.body })
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