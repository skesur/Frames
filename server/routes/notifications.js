import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  subscribeToRestock,
} from '../controllers/notificationController.js'

const router = Router()

// All routes require authentication
router.use(protect)

router.get('/',            getNotifications)
router.post('/notify-me',  subscribeToRestock)
router.put('/read-all',    markAllNotificationsAsRead)
router.put('/:id/read',    markNotificationAsRead)

export default router
