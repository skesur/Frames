import mongoose   from 'mongoose'
import User        from '../models/User.js'
import Product      from '../models/Product.js'
import Order         from '../models/Order.js'
import { AppError }   from '../middleware/errorHandler.js'

const PRODUCT_CATEGORIES = ['top-sellers', 'new-arrivals', 'round-frames', 'square-frames', 'sunglasses']
const ORDER_STATUSES     = ['processing', 'shipped', 'delivered']

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

/* ───────────────────────────────────────────
   A. GET /api/admin/stats
─────────────────────────────────────────── */
export const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, totalOrders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ])

    const [processingOrders, shippedOrders, deliveredOrders] = await Promise.all([
      Order.countDocuments({ orderStatus: 'processing' }),
      Order.countDocuments({ orderStatus: 'shipped' }),
      Order.countDocuments({ orderStatus: 'delivered' }),
    ])

    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$pricing.total' } } },
    ])
    const totalRevenue = revenueAgg[0]?.total || 0

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')

    res.json({
      success: true,
      stats: {
        totalUsers, totalProducts, totalOrders,
        processingOrders, shippedOrders, deliveredOrders,
        totalRevenue, recentOrders,
      },
    })
  } catch (err) {
    next(err)
  }
}

/* ───────────────────────────────────────────
   B. GET /api/admin/products
─────────────────────────────────────────── */
export const getAdminProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query
    const filter = {}

    if (category && category !== 'all') filter.category = category

    if (search) {
      filter.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category:    { $regex: search, $options: 'i' } },
        { badge:       { $regex: search, $options: 'i' } },
      ]
    }

    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, count: products.length, products })
  } catch (err) {
    next(err)
  }
}

/* ───────────────────────────────────────────
   C. POST /api/admin/products
─────────────────────────────────────────── */
export const createAdminProduct = async (req, res, next) => {
  try {
    const {
      name, slug, price, category, images,
      description, badge, rating, modelFile, inStock, featured,
    } = req.body

    if (!name?.trim())  return next(new AppError('Product name is required', 400))
    if (!slug?.trim())  return next(new AppError('Slug is required', 400))

    if (price === undefined || price === null || isNaN(price) || Number(price) < 0)
      return next(new AppError('Price must be a number greater than or equal to 0', 400))

    if (!category || !PRODUCT_CATEGORIES.includes(category))
      return next(new AppError(`Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}`, 400))

    if (!Array.isArray(images) || images.length === 0 || !images[0]?.trim())
      return next(new AppError('At least one image path is required', 400))

    if (rating !== undefined && rating !== null && rating !== '') {
      const r = Number(rating)
      if (isNaN(r) || r < 1 || r > 5) return next(new AppError('Rating must be between 1 and 5', 400))
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, '-')
    const existing   = await Product.findOne({ slug: cleanSlug })
    if (existing) return next(new AppError('A product with this slug already exists', 400))

    const product = await Product.create({
      name:        name.trim(),
      slug:        cleanSlug,
      price:       Number(price),
      description: description?.trim() || '',
      category,
      badge:       badge?.trim() || '',
      rating:      rating ? Number(rating) : 5,
      images:      images.filter(Boolean),
      modelFile:   modelFile?.trim() || '',
      inStock:     inStock !== undefined ? Boolean(inStock) : true,
      featured:    Boolean(featured),
    })

    res.status(201).json({ success: true, product })
  } catch (err) {
    next(err)
  }
}

/* ───────────────────────────────────────────
   D. PUT /api/admin/products/:id
─────────────────────────────────────────── */
export const updateAdminProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!isValidId(id)) return next(new AppError('Invalid product ID', 400))

    const product = await Product.findById(id)
    if (!product) return next(new AppError('Product not found', 404))

    const allowed = ['name', 'slug', 'price', 'description', 'category', 'badge', 'rating', 'images', 'modelFile', 'inStock', 'featured']

    for (const field of allowed) {
      if (req.body[field] === undefined) continue

      if (field === 'price') {
        const p = Number(req.body.price)
        if (isNaN(p) || p < 0) return next(new AppError('Price must be a number greater than or equal to 0', 400))
        product.price = p
        continue
      }
      if (field === 'category') {
        if (!PRODUCT_CATEGORIES.includes(req.body.category))
          return next(new AppError(`Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}`, 400))
        product.category = req.body.category
        continue
      }
      if (field === 'rating') {
        const r = Number(req.body.rating)
        if (isNaN(r) || r < 1 || r > 5) return next(new AppError('Rating must be between 1 and 5', 400))
        product.rating = r
        continue
      }
      if (field === 'slug') {
        product.slug = req.body.slug.trim().toLowerCase().replace(/\s+/g, '-')
        continue
      }
      if (field === 'images') {
        if (!Array.isArray(req.body.images) || req.body.images.length === 0)
          return next(new AppError('At least one image path is required', 400))
        product.images = req.body.images.filter(Boolean)
        continue
      }

      product[field] = req.body[field]
    }

    await product.save()
    res.json({ success: true, product })
  } catch (err) {
    next(err)
  }
}

/* ───────────────────────────────────────────
   E. DELETE /api/admin/products/:id
─────────────────────────────────────────── */
export const deleteAdminProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!isValidId(id)) return next(new AppError('Invalid product ID', 400))

    const product = await Product.findById(id)
    if (!product) return next(new AppError('Product not found', 404))

    await product.deleteOne()

    // Orders store item snapshots (name/price/image at order time),
    // so deleting the product does not corrupt past order history.
    res.json({ success: true, message: 'Product deleted successfully' })
  } catch (err) {
    next(err)
  }
}

/* ───────────────────────────────────────────
   F. GET /api/admin/orders
─────────────────────────────────────────── */
export const getAdminOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query
    const filter = {}
    if (status && status !== 'all') filter.orderStatus = status

    let orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone')

    if (search) {
      const q = search.toLowerCase()
      orders = orders.filter((o) =>
        o.orderId?.toLowerCase().includes(q) ||
        o.delivery?.phone?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q) ||
        o.user?.name?.toLowerCase().includes(q)
      )
    }

    res.json({ success: true, count: orders.length, orders })
  } catch (err) {
    next(err)
  }
}

/* ───────────────────────────────────────────
   G. PUT /api/admin/orders/:id/status
─────────────────────────────────────────── */
export const updateAdminOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { orderStatus } = req.body

    if (!isValidId(id)) return next(new AppError('Invalid order ID', 400))
    if (!orderStatus || !ORDER_STATUSES.includes(orderStatus))
      return next(new AppError(`Status must be one of: ${ORDER_STATUSES.join(', ')}`, 400))

    const order = await Order.findById(id)
    if (!order) return next(new AppError('Order not found', 404))

    order.orderStatus = orderStatus
    await order.save()

    res.json({ success: true, order })
  } catch (err) {
    next(err)
  }
}

/* ───────────────────────────────────────────
   H. GET /api/admin/users
─────────────────────────────────────────── */
export const getAdminUsers = async (req, res, next) => {
  try {
    const { search } = req.query
    const filter = {}

    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 })
    res.json({ success: true, count: users.length, users })
  } catch (err) {
    next(err)
  }
}

/* ───────────────────────────────────────────
   I. PUT /api/admin/users/:id/role
─────────────────────────────────────────── */
export const updateAdminUserRole = async (req, res, next) => {
  try {
    const { id } = req.params
    const { role } = req.body

    if (!isValidId(id)) return next(new AppError('Invalid user ID', 400))
    if (!role || !['user', 'admin'].includes(role))
      return next(new AppError('Role must be either "user" or "admin"', 400))

    if (req.user.id === id && role !== 'admin') {
      return next(new AppError('You cannot remove your own admin access', 400))
    }

    const user = await User.findById(id)
    if (!user) return next(new AppError('User not found', 404))

    user.role = role
    await user.save()

    const safeUser = user.toObject()
    delete safeUser.password

    res.json({ success: true, user: safeUser })
  } catch (err) {
    next(err)
  }
}