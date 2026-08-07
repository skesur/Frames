import mongoose from 'mongoose'

const restockSubscriptionSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true }
)

// Prevent a user from subscribing to the same product multiple times
restockSubscriptionSchema.index({ user: 1, product: 1 }, { unique: true })

export default mongoose.model('RestockSubscription', restockSubscriptionSchema)
