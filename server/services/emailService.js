// SMTP Email service disabled. Notifications are now handled in-app on the website.

export const sendOrderReceiptEmail = async (user, order) => {
  console.log(`[Email Service] Mock email: Order receipt email logic is disabled for order ${order?.orderId}`)
}
