import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null means global (for all users)
    type:    { type: String, enum: ['in-stock', 'new-product', 'general'], required: true },
    title:   { type: String, required: true },
    message: { type: String, required: true },
    link:    { type: String, default: '' },
    isRead:  { type: Boolean, default: false }, // for private user notifications
    readBy:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // for global notifications to track which users have read it
  },
  { timestamps: true }
)

export default mongoose.model('Notification', notificationSchema)
