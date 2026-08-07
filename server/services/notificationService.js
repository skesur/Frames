import Notification from '../models/Notification.js'
import RestockSubscription from '../models/RestockSubscription.js'
import Product from '../models/Product.js'

/**
 * Sends restock alert notifications to all users who subscribed to a product.
 * Triggers when product stock goes from 0 to > 0.
 * 
 * @param {string} productId - MongoDB ID of the restocked product
 */
export const triggerRestockNotifications = async (productId) => {
  try {
    const product = await Product.findById(productId)
    if (!product) return

    // Find all users subscribed to this product
    const subscriptions = await RestockSubscription.find({ product: productId })
    if (subscriptions.length === 0) return

    console.log(`[Notification Service] Found ${subscriptions.length} restock subscriptions for: ${product.name}`)

    const notificationsToCreate = subscriptions.map((sub) => ({
      user: sub.user,
      type: 'in-stock',
      title: 'Back In Stock! ⚡',
      message: `Great news! The cybernetic eyewear "${product.name}" is back in stock. Grab yours now!`,
      link: `/product/${product.slug}`,
      isRead: false,
    }))

    // Bulk insert the notifications
    await Notification.insertMany(notificationsToCreate)

    // Clear subscriptions
    await RestockSubscription.deleteMany({ product: productId })
    console.log(`[Notification Service] Triggered restock alerts and cleared subscriptions for: ${product.name}`)
  } catch (err) {
    console.error('[Notification Service] Error in triggerRestockNotifications:', err.message)
  }
}

/**
 * Sends a global notification to all users alerting them of a newly added product.
 * Triggers when a new product is created by an admin.
 * 
 * @param {object} product - The newly created Product document
 */
export const triggerNewProductNotification = async (product) => {
  try {
    if (!product) return

    // Create a global notification (user = null)
    await Notification.create({
      user: null,
      type: 'new-product',
      title: 'New Arrival! 🔥',
      message: `A new cyber frame "${product.name}" has just dropped! Explore the fresh cybernetic style in the catalog.`,
      link: `/product/${product.slug}`,
    })

    console.log(`[Notification Service] Triggered global new-product notification for: ${product.name}`)
  } catch (err) {
    console.error('[Notification Service] Error in triggerNewProductNotification:', err.message)
  }
}
