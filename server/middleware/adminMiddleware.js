import User from '../models/User.js'
import { AppError } from './errorHandler.js'

export const adminOnly = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return next(new AppError('Not authorized', 401))
    }

    const user = await User.findById(req.user.id)

    if (!user) {
      return next(new AppError('User not found', 404))
    }

    if (user.role !== 'admin') {
      return next(new AppError('Admin access required', 403))
    }

    req.admin = user
    next()
  } catch (err) {
    next(err)
  }
}