import mongoose from 'mongoose'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { AppError } from '../middleware/errorHandler.js'

function formatCart(cart) {
  const items = (cart?.items || [])
    .filter((item) => item.product)
    .map((item) => ({
      ...item.product.toObject(),
      quantity: item.quantity,
    }))

  return { items }
}

async function validateItems(items) {
  if (!Array.isArray(items)) {
    throw new AppError('Cart items must be an array', 400)
  }

  if (items.length > 50) {
    throw new AppError('Cart cannot contain more than 50 different products', 400)
  }

  const normalized = []

  for (const item of items) {
    if (!mongoose.isValidObjectId(item.product)) {
      throw new AppError('Cart contains an invalid product id', 400)
    }

    const quantity = Number(item.quantity)
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new AppError('Cart item quantity must be between 1 and 99', 400)
    }

    normalized.push({ product: item.product, quantity })
  }

  const productIds = normalized.map((item) => item.product)
  const foundCount = await Product.countDocuments({ _id: { $in: productIds } })
  if (foundCount !== new Set(productIds.map(String)).size) {
    throw new AppError('Cart contains a product that does not exist', 400)
  }

  return normalized
}

export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product')
    res.json({ success: true, cart: formatCart(cart) })
  } catch (err) {
    next(err)
  }
}

export const updateCart = async (req, res, next) => {
  try {
    const items = await validateItems(req.body.items)
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $set: { items } },
      { new: true, upsert: true, runValidators: true }
    ).populate('items.product')

    res.json({ success: true, cart: formatCart(cart) })
  } catch (err) {
    next(err)
  }
}

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $set: { items: [] } },
      { new: true, upsert: true }
    ).populate('items.product')

    res.json({ success: true, cart: formatCart(cart) })
  } catch (err) {
    next(err)
  }
}
