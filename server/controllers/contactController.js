import ContactMessage from '../models/ContactMessage.js'
import { AppError } from '../middleware/errorHandler.js'

const isValidEmail = (email = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const isValidPhone = (phone = '') => !phone || /^\d{10}$/.test(phone)

export const createContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone = '', subject, message } = req.body

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return next(new AppError('Name, email, subject and message are required', 400))
    }

    if (!isValidEmail(email)) {
      return next(new AppError('Please enter a valid email address', 400))
    }

    if (!isValidPhone(phone)) {
      return next(new AppError('Phone number must be exactly 10 digits', 400))
    }

    const contactMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    })

    res.status(201).json({ success: true, message: 'Message sent successfully', contactMessage })
  } catch (err) {
    next(err)
  }
}
