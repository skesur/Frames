import { Router }           from 'express'
import {
  getProducts,
  getProductById,
  getProductBySlug,
} from '../controllers/productController.js'

const router = Router()

router.get('/',             getProducts)
router.get('/slug/:slug',   getProductBySlug)
router.get('/:id',          getProductById)

export default router