import Order from '../models/Order.js'

/**
 * Automates the transition of order status through various fulfillment stages.
 * 
 * - Transitions from 'placed' -> (10s) -> 'processing' -> (10s) -> 'shipped'.
 * - If paymentMethod is NOT 'cod', transitions -> (10s) -> 'delivered'.
 * - If paymentMethod is 'cod', stops at 'shipped' state.
 * 
 * @param {string} orderId - MongoDB ID of the order
 * @param {string} paymentMethod - Method of payment ('cod', 'card', etc.)
 */
export const startOrderStatusAutomation = (orderId, paymentMethod) => {
  console.log(`[Order Automation] Initialized automation for order: ${orderId} (${paymentMethod})`)

  // 10s: transition to processing
  setTimeout(async () => {
    try {
      const order = await Order.findById(orderId)
      if (!order) {
        console.log(`[Order Automation] Order ${orderId} not found, stopping automation.`)
        return
      }
      
      order.orderStatus = 'processing'
      await order.save()
      console.log(`[Order Automation] Order ${orderId} status set to 'processing'.`)

      // 20s (10s after processing): transition to shipped
      setTimeout(async () => {
        try {
          const order2 = await Order.findById(orderId)
          if (!order2) {
            console.log(`[Order Automation] Order ${orderId} not found, stopping automation.`)
            return
          }

          order2.orderStatus = 'shipped'
          await order2.save()
          console.log(`[Order Automation] Order ${orderId} status set to 'shipped'.`)

          // If COD, halt progress right here and never deliver
          if (paymentMethod === 'cod') {
            console.log(`[Order Automation] Order ${orderId} is Cash on Delivery. Stopping at 'shipped' stage.`)
            return
          }

          // 30s (10s after shipped): transition to delivered
          setTimeout(async () => {
            try {
              const order3 = await Order.findById(orderId)
              if (!order3) {
                console.log(`[Order Automation] Order ${orderId} not found, stopping automation.`)
                return
              }

              order3.orderStatus = 'delivered'
              await order3.save()
              console.log(`[Order Automation] Order ${orderId} status set to 'delivered'.`)
            } catch (err) {
              console.error(`[Order Automation] Error transitioning order ${orderId} to delivered:`, err.message)
            }
          }, 10000)

        } catch (err) {
          console.error(`[Order Automation] Error transitioning order ${orderId} to shipped:`, err.message)
        }
      }, 10000)

    } catch (err) {
      console.error(`[Order Automation] Error transitioning order ${orderId} to processing:`, err.message)
    }
  }, 10000)
}
