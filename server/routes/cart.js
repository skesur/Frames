import { Router } from 'express'
import { clearCart, getCart, updateCart } from '../controllers/cartController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/',    protect, getCart)
router.put('/',    protect, updateCart)
router.delete('/', protect, clearCart)

export default router
