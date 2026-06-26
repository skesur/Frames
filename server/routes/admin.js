import { Router }   from 'express'
import { protect }  from '../middleware/authMiddleware.js'
import { adminOnly } from '../middleware/adminMiddleware.js'
import {
  getAdminStats,
  getAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct,
  getAdminOrders, updateAdminOrderStatus,
  getAdminUsers, updateAdminUserRole,
  getAdminMessages, updateAdminMessageStatus,
} from '../controllers/adminController.js'

const router = Router()

router.use(protect, adminOnly)

router.get('/stats', getAdminStats)

router.get('/products',        getAdminProducts)
router.post('/products',       createAdminProduct)
router.put('/products/:id',    updateAdminProduct)
router.delete('/products/:id', deleteAdminProduct)

router.get('/orders',            getAdminOrders)
router.put('/orders/:id/status', updateAdminOrderStatus)

router.get('/users',          getAdminUsers)
router.put('/users/:id/role', updateAdminUserRole)

router.get('/messages', getAdminMessages)
router.put('/messages/:id/status', updateAdminMessageStatus)

export default router
