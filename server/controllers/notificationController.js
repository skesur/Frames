import Notification from '../models/Notification.js'
import RestockSubscription from '../models/RestockSubscription.js'
import Product from '../models/Product.js'
import { AppError } from '../middleware/errorHandler.js'

// GET /api/notifications
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id

    // Fetch user-specific notifications OR global notifications (user is null)
    const notifications = await Notification.find({
      $or: [
        { user: userId },
        { user: null }
      ]
    }).sort({ createdAt: -1 })

    // Map global notifications' read status based on 'readBy' array
    const mapped = notifications.map((notif) => {
      const isRead = notif.user 
        ? notif.isRead 
        : notif.readBy.includes(userId)

      return {
        _id:       notif._id,
        type:      notif.type,
        title:     notif.title,
        message:   notif.message,
        link:      notif.link,
        isRead,
        createdAt: notif.createdAt,
      }
    })

    res.json({ success: true, notifications: mapped })
  } catch (err) {
    next(err)
  }
}

// PUT /api/notifications/:id/read
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    const notif = await Notification.findById(id)
    if (!notif) return next(new AppError('Notification not found', 404))

    if (notif.user) {
      // Private notification validation
      if (notif.user.toString() !== userId) {
        return next(new AppError('Unauthorized update attempt', 403))
      }
      notif.isRead = true
    } else {
      // Global notification: append user to readBy array if not already there
      if (!notif.readBy.includes(userId)) {
        notif.readBy.push(userId)
      }
    }

    await notif.save()
    res.json({ success: true, message: 'Notification marked as read' })
  } catch (err) {
    next(err)
  }
}

// PUT /api/notifications/read-all
export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id

    // 1. Mark private unread notifications as read
    await Notification.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true } }
    )

    // 2. Mark global notifications as read for this user
    await Notification.updateMany(
      { user: null, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    )

    res.json({ success: true, message: 'All notifications marked as read' })
  } catch (err) {
    next(err)
  }
}

// POST /api/notifications/notify-me
export const subscribeToRestock = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { productId } = req.body

    if (!productId) return next(new AppError('Product ID is required', 400))

    const product = await Product.findById(productId)
    if (!product) return next(new AppError('Product not found', 404))

    if (product.stock > 0 && product.inStock !== false) {
      return next(new AppError('Product is already in stock. No need to subscribe!', 400))
    }

    // Check if subscription already exists
    const existing = await RestockSubscription.findOne({ user: userId, product: productId })
    if (existing) {
      return res.json({ success: true, message: 'You are already subscribed to restock alerts for this product.' })
    }

    // Create subscription
    await RestockSubscription.create({ user: userId, product: productId })

    // Create immediate user notification confirming subscription
    await Notification.create({
      user: userId,
      type: 'general',
      title: 'Restock Subscription Confirmed 🔔',
      message: `You have successfully subscribed to restock alerts for "${product.name}". We will alert you the moment it returns to stock.`,
      link: `/product/${product.slug}`,
    })

    res.status(201).json({ success: true, message: `Subscribed to restock alerts for ${product.name}` })
  } catch (err) {
    next(err)
  }
}
