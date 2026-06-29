import nodemailer from 'nodemailer'

const isSmtpConfigured = () => {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

export const sendOrderReceiptEmail = async (user, order) => {
  const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
  
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Format Order Items
  let orderItemsHTML = ''
  order.items.forEach((item) => {
    const itemTotal = item.price * item.quantity
    orderItemsHTML += `
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.03);">
        <td style="padding: 12px 0; font-size: 13px; color: #F0EEF8; vertical-align: top;">
          <span style="font-weight: bold; color: #F0EEF8;">${item.name}</span>
          <div style="font-size: 11px; color: #A09EB0; margin-top: 3px;">Qty: ${item.quantity} &times; ${formatPrice(item.price)}</div>
        </td>
        <td align="right" style="padding: 12px 0; font-size: 13px; font-family: 'Courier New', Courier, monospace; color: #F0EEF8; font-weight: bold; vertical-align: top;">
          ${formatPrice(itemTotal)}
        </td>
      </tr>
    `
  })

  // Format Prescription Details
  let prescriptionHTML = ''
  if (order.prescription && order.prescription.lensType === 'power') {
    prescriptionHTML = `
      <tr>
        <td style="padding-bottom: 10px; font-size: 13px; color: #A09EB0; padding-left: 15px;">- Left Eye (SPH / CYL):</td>
        <td align="right" style="padding-bottom: 10px; font-size: 13px; color: #F0EEF8; font-family: 'Courier New', Courier, monospace;">
          ${order.prescription.leftPower || '0.00'} SPH / ${order.prescription.leftCylinder || '0.00'} CYL
        </td>
      </tr>
      <tr>
        <td style="padding-bottom: 10px; font-size: 13px; color: #A09EB0; padding-left: 15px;">- Right Eye (SPH / CYL):</td>
        <td align="right" style="padding-bottom: 10px; font-size: 13px; color: #F0EEF8; font-family: 'Courier New', Courier, monospace;">
          ${order.prescription.rightPower || '0.00'} SPH / ${order.prescription.rightCylinder || '0.00'} CYL
        </td>
      </tr>
    `
  }

  // HTML Email Template
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmation - Frames</title>
  <style>
    body { margin: 0; padding: 0; background-color: #080808; color: #F0EEF8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
  </style>
</head>
<body style="background-color: #080808; color: #F0EEF8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px 0; margin: 0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #080808; width: 100%;">
    <tr>
      <td align="center">
        <!-- Mail Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #0d0d0d; border: 1px solid rgba(155, 92, 246, 0.15); border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 20px; background: linear-gradient(135deg, #0d0d0d 0%, #151020 100%); border-bottom: 1px solid rgba(155, 92, 246, 0.15);">
              <h1 style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #9B5CF6; text-transform: uppercase;">FRAMES</h1>
              <p style="margin: 10px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #00F5C4; font-family: 'Courier New', Courier, monospace;">// ORDER SECURED //</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #F0EEF8; line-height: 1.6;">Hi ${user.name || 'Customer'},</p>
              <p style="margin: 0 0 30px 0; font-size: 14px; color: #A09EB0; line-height: 1.6;">Thank you for your order! Your payment has been received, and our production lab is crafting your eyewear. Here are your transaction details:</p>
              
              <!-- Order Info Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #121214; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 8px; font-size: 13px; color: #A09EB0;">Order ID:</td>
                        <td align="right" style="padding-bottom: 8px; font-family: 'Courier New', Courier, monospace; font-size: 13px; color: #00F5C4; font-weight: bold;">${order.orderId}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px; font-size: 13px; color: #A09EB0;">Date:</td>
                        <td align="right" style="padding-bottom: 8px; font-size: 13px; color: #F0EEF8;">${orderDate}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px; font-size: 13px; color: #A09EB0;">Payment Method:</td>
                        <td align="right" style="padding-bottom: 8px; font-size: 13px; color: #F0EEF8; text-transform: uppercase;">${order.paymentMethod}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #A09EB0; vertical-align: top; padding-top: 4px;">Delivery Address:</td>
                        <td align="right" style="font-size: 13px; color: #F0EEF8; line-height: 1.4; max-width: 250px;">
                          ${order.delivery.address}<br/>
                          PIN: ${order.delivery.pincode}<br/>
                          Phone: ${order.delivery.phone}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Items Title -->
              <h3 style="margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #FF6B35; font-weight: 800;">// ITEMS ORDERED</h3>
              
              <!-- Items Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px; border-collapse: collapse;">
                ${orderItemsHTML}
              </table>
              
              <!-- Prescription & Customize Details -->
              <h3 style="margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #9B5CF6; font-weight: 800;">// SPECIFICATIONS</h3>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #121214; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 6px; margin-bottom: 35px; padding: 20px;">
                <tr>
                  <td style="padding-bottom: 10px; font-size: 13px; color: #A09EB0; vertical-align: top;">Lens Type:</td>
                  <td align="right" style="padding-bottom: 10px; font-size: 13px; color: #F0EEF8; text-transform: capitalize; vertical-align: top;">${order.prescription.lensType} power</td>
                </tr>
                ${prescriptionHTML}
                <tr>
                  <td style="padding-bottom: 10px; font-size: 13px; color: #A09EB0; vertical-align: top;">Lens Coating:</td>
                  <td align="right" style="padding-bottom: 10px; font-size: 13px; color: #F0EEF8; text-transform: capitalize; vertical-align: top;">${order.lensCoating}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #A09EB0; vertical-align: top;">Delivery Speed:</td>
                  <td align="right" style="font-size: 13px; color: #F0EEF8; text-transform: capitalize; vertical-align: top;">${order.delivery.method}</td>
                </tr>
              </table>
              
              <!-- Price Breakdown -->
              <h3 style="margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #00F5C4; font-weight: 800;">// INVOICE SUMMARY</h3>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 15px;">
                <tr>
                  <td style="padding-bottom: 8px; font-size: 13px; color: #A09EB0;">Subtotal:</td>
                  <td align="right" style="padding-bottom: 8px; font-size: 13px; color: #F0EEF8;">${formatPrice(order.pricing.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding-bottom: 8px; font-size: 13px; color: #A09EB0;">Lens Coating Fee:</td>
                  <td align="right" style="padding-bottom: 8px; font-size: 13px; color: #F0EEF8;">${formatPrice(order.pricing.coatingPrice)}</td>
                </tr>
                <tr>
                  <td style="padding-bottom: 8px; font-size: 13px; color: #A09EB0;">Delivery Charge:</td>
                  <td align="right" style="padding-bottom: 8px; font-size: 13px; color: #F0EEF8;">${formatPrice(order.pricing.deliveryPrice)}</td>
                </tr>
                <tr>
                  <td style="padding-bottom: 12px; font-size: 13px; color: #A09EB0; border-bottom: 1px dashed rgba(255, 255, 255, 0.08);">Estimated GST (18%):</td>
                  <td align="right" style="padding-bottom: 12px; font-size: 13px; color: #F0EEF8; border-bottom: 1px dashed rgba(255, 255, 255, 0.08);">${formatPrice(order.pricing.tax)}</td>
                </tr>
                <tr>
                  <td style="padding-top: 15px; font-size: 16px; color: #F0EEF8; font-weight: bold;">Grand Total:</td>
                  <td align="right" style="padding-top: 15px; font-size: 18px; color: #00F5C4; font-weight: bold; font-family: 'Courier New', Courier, monospace;">${formatPrice(order.pricing.total)}</td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 40px;">
                <tr>
                  <td align="center">
                    <a href="${CLIENT_URL}/profile" style="display: inline-block; background: linear-gradient(90deg, #9B5CF6 0%, #FF6B35 100%); color: #F0EEF8; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 4px 15px rgba(155, 92, 246, 0.25);">TRACK YOUR ORDER</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #080808; border-top: 1px solid rgba(255, 255, 255, 0.03); color: #605E70; font-size: 11px; line-height: 1.6;">
              <p style="margin: 0 0 5px 0;">This is an automated transaction receipt. Please do not reply directly to this email.</p>
              <p style="margin: 0 0 15px 0;">For support, contact us at <a href="mailto:support@frames.com" style="color: #9B5CF6; text-decoration: none;">support@frames.com</a></p>
              <p style="margin: 0; font-family: 'Courier New', Courier, monospace; letter-spacing: 1px;">FRAMES EYEWEAR © 2026 // MADE WITH PASSION IN INDIA</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  if (!isSmtpConfigured()) {
    console.log(`\n==================================================`)
    console.log(`[Email Service Mock] SMTP is not configured. Mocking order email to user:`)
    console.log(`To: ${user.email}`)
    console.log(`Subject: [FRAMES] Order Confirmation - ${order.orderId}`)
    console.log(`Summary of items:`)
    order.items.forEach(item => console.log(`  - ${item.name} (${item.quantity}x @ ${formatPrice(item.price)})`))
    console.log(`Total Price: ${formatPrice(order.pricing.total)}`)
    console.log(`==================================================\n`)
    return
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    const fromAddress = process.env.SMTP_FROM || `"Frames Eyewear" <no-reply@frames.com>`

    await transporter.sendMail({
      from: fromAddress,
      to: user.email,
      subject: `[FRAMES] Order Confirmation - ${order.orderId}`,
      html: emailHtml
    })

    console.log(`[Email Service] Confirmation email sent successfully to ${user.email} for order ${order.orderId}`)
  } catch (error) {
    console.error(`[Email Service Error] Failed to send order receipt email to ${user.email}:`, error)
    // We intentionally swallow this error so it doesn't crash or block user checkout response
  }
}
