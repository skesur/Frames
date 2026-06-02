import Product from '../models/Product.js'
import { AppError } from '../middleware/errorHandler.js'

// GET /api/products?category=&search=&featured=
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, featured } = req.query
    const filter = {}

    if (category && category !== 'all') {
      filter.category = category
    }

    if (search) {
      filter.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category:    { $regex: search, $options: 'i' } },
      ]
    }

    if (featured === 'true') {
      filter.featured = true
    }

    const products = await Product.find(filter).sort({ createdAt: -1 })

    res.json({ success: true, count: products.length, products })
  } catch (err) {
    next(err)
  }
}

// GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return next(new AppError('Product not found', 404))
    res.json({ success: true, product })
  } catch (err) {
    next(err)
  }
}

// GET /api/products/slug/:slug
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
    if (!product) return next(new AppError('Product not found', 404))
    res.json({ success: true, product })
  } catch (err) {
    next(err)
  }
}