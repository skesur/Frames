import { Router }  from 'express'
import {
  register, login, getMe, updateMe, deleteMe,
} from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/register', register)
router.post('/login',    login)
router.get('/me',        protect, getMe)
router.put('/me',        protect, updateMe)
router.delete('/me',     protect, deleteMe)

export default router