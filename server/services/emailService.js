import nodemailer from 'nodemailer'
import User from '../models/User.js'

// Helper to create SMTP Transporter
const getTransporter = () => {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '465', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    console.log('[Email Service] SMTP configurations missing. Falling back to log-only mock mode.')
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  })
}

// Helper to generate premium cyberpunk HTML template wrapper
const generateHtmlTemplate = (title, contentHTML) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            background-color: #080808;
            color: #f3f4f6;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #0c0c0c;
            border: 1px solid rgba(155, 92, 246, 0.2);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(155, 92, 246, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #150d2a, #0c0c0c);
            padding: 40px 30px;
            text-align: center;
            border-b: 1px solid rgba(255, 255, 255, 0.05);
          }
          .logo {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
            text-transform: lowercase;
            color: #ffffff;
            text-decoration: none;
          }
          .logo-dot {
            color: #9b5cf6;
          }
          .content {
            padding: 40px 30px;
            line-height: 1.6;
          }
          h1 {
            color: #ffffff;
            font-size: 22px;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 20px;
          }
          p {
            color: #9ca3af;
            font-size: 15px;
            margin-bottom: 20px;
          }
          .btn-container {
            text-align: center;
            margin: 35px 0;
          }
          .btn {
            background-color: #9b5cf6;
            color: #ffffff !important;
            padding: 12px 30px;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            border-radius: 9999px;
            display: inline-block;
            box-shadow: 0 0 20px rgba(155, 92, 246, 0.4);
            transition: all 0.2s ease;
          }
          .btn-ember {
            background-color: #ff6b35;
            box-shadow: 0 0 20px rgba(255, 107, 53, 0.35);
          }
          .details-card {
            background-color: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
          }
          .details-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 13px;
          }
          .details-label {
            color: #6b7280;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .details-value {
            color: #ffffff;
          }
          .footer {
            background-color: #050505;
            padding: 20px 30px;
            text-align: center;
            font-size: 11px;
            color: #4b5563;
            border-t: 1px solid rgba(255, 255, 255, 0.03);
          }
          .footer a {
            color: #9b5cf6;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <span class="logo">frames<span class="logo-dot">.</span></span>
          </div>
          <div class="content">
            ${contentHTML}
          </div>
          <div class="footer">
            &copy; 2026 Frames Eyewear. All rights reserved.<br>
            Delivering premium cyberpunk optics. <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}">Visit Store</a>
          </div>
        </div>
      </body>
    </html>
  `
}

// 1. Send Order Status Email (Processing / Delivered)
export const sendOrderUpdateEmail = async (user, order, status) => {
  const transporter = getTransporter()
  const to = user.email
  const from = process.env.SMTP_FROM || '"Frames Eyewear" <no-reply@frames.com>'
  
  let subject = ''
  let heading = ''
  let messageText = ''
  let btnStyleClass = ''
  let btnText = ''

  if (status === 'processing') {
    subject = `Your Order "${order.orderId}" is Processing ⚙️`
    heading = `Order is Processing`
    messageText = `Thank you for ordering with Frames! We have verified your payment details and are now actively processing your order. Our team is handcrafting your cyber eyewear frames with precision lens coating. We will email you again when it ships.`
    btnText = `Track Order`
    btnStyleClass = 'btn'
  } else if (status === 'delivered') {
    subject = `Your Order "${order.orderId}" has been Delivered! 🎉`
    heading = `Order Delivered!`
    messageText = `Great news! Your order has been delivered successfully. Your premium cyber eyewear frames are ready to wear. We hope you love the precision optics!`
    btnText = `Share Feedback`
    btnStyleClass = 'btn btn-ember'
  } else {
    return
  }

  const contentHTML = `
    <h1>${heading}</h1>
    <p>Hi ${user.name || 'Optics Collector'},</p>
    <p>${messageText}</p>
    
    <div class="details-card">
      <div class="details-row">
        <span class="details-label">Order Reference</span>
        <span class="details-value">${order.orderId}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Order Total</span>
        <span class="details-value">₹${order.pricing.total.toLocaleString('en-IN')}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Status</span>
        <span class="details-value" style="color: ${status === 'delivered' ? '#00f5c4' : '#9b5cf6'}">${status.toUpperCase()}</span>
      </div>
    </div>
    
    <div class="btn-container">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/profile?order=${order._id}" class="${btnStyleClass}">${btnText}</a>
    </div>
  `

  const html = generateHtmlTemplate(subject, contentHTML)

  if (!transporter) {
    console.log(`[Email Service Mock] Order Update Alert to ${to} (${subject})`)
    return
  }

  try {
    await transporter.sendMail({ from, to, subject, html })
    console.log(`[Email Service] Order status email successfully sent to ${to} for order ${order.orderId}`)
  } catch (err) {
    console.error(`[Email Service] Failed to send order update email to ${to}:`, err.message)
  }
}

// 2. Send Restock Alert Email
export const sendRestockAlertEmail = async (user, product) => {
  const transporter = getTransporter()
  const to = user.email
  const from = process.env.SMTP_FROM || '"Frames Eyewear" <no-reply@frames.com>'
  const subject = `Back in Stock: "${product.name}" is Ready! 📦`

  const contentHTML = `
    <h1>Your Subscribed Frame is Back!</h1>
    <p>Hi ${user.name || 'Optics Collector'},</p>
    <p>You asked us to notify you when <strong>"${product.name}"</strong> is back in stock. We have just replenished our supply! Stock is highly limited, so grab your premium cyber eyewear frames before they are gone again.</p>
    
    <div class="details-card" style="text-align: center;">
      <img src="${process.env.CLIENT_URL || 'http://localhost:5173'}${product.images?.[0] || ''}" alt="${product.name}" style="max-width: 150px; margin-bottom: 15px;" />
      <div class="details-row" style="justify-content: center; gap: 20px;">
        <span class="details-label">Price:</span>
        <span class="details-value">₹${product.price.toLocaleString('en-IN')}</span>
      </div>
    </div>
    
    <div class="btn-container">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/product/${product._id}" class="btn btn-ember">Buy Now</a>
    </div>
  `

  const html = generateHtmlTemplate(subject, contentHTML)

  if (!transporter) {
    console.log(`[Email Service Mock] Restock Alert to ${to} (${product.name})`)
    return
  }

  try {
    await transporter.sendMail({ from, to, subject, html })
    console.log(`[Email Service] Restock email successfully sent to ${to} for product ${product.name}`)
  } catch (err) {
    console.error(`[Email Service] Failed to send restock email to ${to}:`, err.message)
  }
}

// 3. Broadcast New Product Arrival Email to All Registered Users
export const sendNewArrivalBroadcast = async (product) => {
  const transporter = getTransporter()
  const from = process.env.SMTP_FROM || '"Frames Eyewear" <no-reply@frames.com>'
  const subject = `New Arrival: Meet the "${product.name}" 🚀`

  // Fetch all registered users
  let users = []
  try {
    users = await User.find({ role: 'user' }) // Send only to standard customers, not admins
  } catch (dbErr) {
    console.error('[Email Service] Failed to fetch users for broadcast:', dbErr.message)
    return
  }

  if (users.length === 0) {
    console.log('[Email Service] No users found to broadcast.')
    return
  }

  const contentHTML = `
    <h1>Introducing "${product.name}"</h1>
    <p>Hi Optics Collector,</p>
    <p>We are thrilled to unveil our newest edition to the collection: <strong>"${product.name}"</strong>. Engineered with modern aesthetics, premium construction, and designed to redefine your style.</p>
    
    <div class="details-card" style="text-align: center;">
      <img src="${process.env.CLIENT_URL || 'http://localhost:5173'}${product.images?.[0] || ''}" alt="${product.name}" style="max-width: 150px; margin-bottom: 15px;" />
      <p style="font-size: 13px; color: #9ca3af; margin: 10px 0;">${product.description || ''}</p>
      <div class="details-row" style="justify-content: center; gap: 20px;">
        <span class="details-label">Introductory Price:</span>
        <span class="details-value">₹${product.price.toLocaleString('en-IN')}</span>
      </div>
    </div>
    
    <div class="btn-container">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/product/${product._id}" class="btn">Examine Optics</a>
    </div>
  `

  const html = generateHtmlTemplate(subject, contentHTML)

  console.log(`[Email Service] Initiating broadcast email for new product "${product.name}" to ${users.length} users.`)

  if (!transporter) {
    console.log(`[Email Service Mock] New Arrival Broadcast for ${product.name} (Simulated for ${users.length} users)`)
    return
  }

  // Loop over users and send email asynchronously (wrapped to prevent crash)
  users.forEach((user) => {
    transporter.sendMail({ from, to: user.email, subject, html })
      .then(() => {
        console.log(`[Email Service] Broadcast sent successfully to ${user.email}`)
      })
      .catch((err) => {
        console.error(`[Email Service] Broadcast failed to send to ${user.email}:`, err.message)
      })
  })
}
