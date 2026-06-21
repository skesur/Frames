import bcrypt      from 'bcryptjs'
import jwt         from 'jsonwebtoken'
import User        from '../models/User.js'
import { AppError } from '../middleware/errorHandler.js'

const ACCESS_TOKEN_EXPIRES_IN = '15m'
const REFRESH_TOKEN_EXPIRES_IN = '30d'

const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN })

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  })

function setRefreshCookie(res, userId) {
  res.cookie('frames_refresh_token', signRefreshToken(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })
}

function clearRefreshCookie(res) {
  res.clearCookie('frames_refresh_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  })
}

function getCookie(req, name) {
  return (req.headers.cookie || '')
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split('=')
    .slice(1)
    .join('=')
}

const sanitize = (user) => ({
  _id:       user._id,
  name:      user.name,
  email:     user.email,
  phone:     user.phone,
  address:   user.address,
  pincode:   user.pincode,
  country:   user.country,
  role:      user.role,
  createdAt: user.createdAt,
})

const isValidPhone = (phone = '') => /^\d{10}$/.test(phone)
const isValidPincode = (pincode = '') => /^\d{6}$/.test(pincode)

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, pincode, country } = req.body

    if (!name || !email || !password)
      return next(new AppError('Name, email and password are required', 400))

    if (password.length < 8)
      return next(new AppError('Password must be at least 8 characters', 400))

    if (phone && !isValidPhone(phone))
      return next(new AppError('Phone number must be exactly 10 digits', 400))

    if (pincode && !isValidPincode(pincode))
      return next(new AppError('Pincode must be exactly 6 digits', 400))

    const exists = await User.findOne({ email: email.toLowerCase().trim() })
    if (exists) return next(new AppError('An account with this email already exists', 400))

    const hashed = await bcrypt.hash(password, 12)

    const user = await User.create({
      name:    name.trim(),
      email:   email.toLowerCase().trim(),
      password: hashed,
      phone:   phone   || '',
      address: address || '',
      pincode: pincode || '',
      country: country || '',
    })

    setRefreshCookie(res, user._id)

    res.status(201).json({
      success: true,
      token:   signAccessToken(user._id),
      user:    sanitize(user),
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return next(new AppError('Email and password are required', 400))

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) return next(new AppError('Invalid email or password', 401))

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return next(new AppError('Invalid email or password', 401))

    setRefreshCookie(res, user._id)

    res.json({
      success: true,
      token:   signAccessToken(user._id),
      user:    sanitize(user),
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return next(new AppError('User not found', 404))
    res.json({ success: true, user: sanitize(user) })
  } catch (err) {
    next(err)
  }
}

// PUT /api/auth/me
export const updateMe = async (req, res, next) => {
  try {
    const { name, phone, address, pincode, country, currentPassword, newPassword, confirmPassword } = req.body

    const user = await User.findById(req.user.id)
    if (!user) return next(new AppError('User not found', 404))

    if (name)    user.name    = name.trim()
    if (phone)   user.phone   = phone
    if (address) user.address = address
    if (pincode) user.pincode = pincode
    if (country) user.country = country

    // Password change — only if currentPassword provided
    if (currentPassword) {
      const valid = await bcrypt.compare(currentPassword, user.password)
      if (!valid) return next(new AppError('Current password is incorrect', 401))

      if (!newPassword || newPassword.length < 8)
        return next(new AppError('New password must be at least 8 characters', 400))

      if (newPassword !== confirmPassword)
        return next(new AppError('New passwords do not match', 400))

      user.password = await bcrypt.hash(newPassword, 12)
    }

    await user.save()

    res.json({ success: true, user: sanitize(user) })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/auth/me
export const deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id)
    clearRefreshCookie(res)
    res.json({ success: true, message: 'Account deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/refresh
export const refresh = async (req, res, next) => {
  try {
    const refreshToken = getCookie(req, 'frames_refresh_token')
    if (!refreshToken) return next(new AppError('Not authorized - no refresh token', 401))

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) return next(new AppError('User not found', 404))

    setRefreshCookie(res, user._id)
    res.json({
      success: true,
      token: signAccessToken(user._id),
      user: sanitize(user),
    })
  } catch (err) {
    clearRefreshCookie(res)
    next(new AppError('Not authorized - invalid refresh token', 401))
  }
}

// POST /api/auth/logout
export const logout = async (req, res) => {
  clearRefreshCookie(res)
  res.json({ success: true, message: 'Logged out successfully' })
}
