import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: String, unique: true },

    items: [
      {
        product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name:     String,
        price:    Number,
        quantity: { type: Number, default: 1 },
        image:    String,
      },
    ],

    prescription: {
      lensType:      { type: String, enum: ['zero-power', 'power'], default: 'zero-power' },
      leftPower:     { type: String, default: 'N/A' },
      rightPower:    { type: String, default: 'N/A' },
      leftCylinder:  { type: String, default: 'N/A' },
      rightCylinder: { type: String, default: 'N/A' },
    },

    lensCoating: {
      type:    String,
      enum:    ['standard', 'none', 'anti-glare', 'blue-light', 'photochromic'],
      default: 'standard',
    },

    delivery: {
      method:  { type: String, enum: ['standard', 'express', 'overnight'], default: 'standard' },
      address: String,
      pincode: String,
      phone:   String,
    },

    pricing: {
      subtotal:      Number,
      coatingPrice:  { type: Number, default: 0 },
      deliveryPrice: { type: Number, default: 0 },
      tax:           Number,
      total:         Number,
    },

    paymentMethod: { type: String, default: 'card' },
    paymentStatus: { type: String, enum: ['pending', 'paid'],                          default: 'pending'    },
    orderStatus:   { type: String, enum: ['processing', 'shipped', 'delivered'],        default: 'processing' },
  },
  { timestamps: true }
)

// Auto-generate orderId before saving.
orderSchema.pre('save', function () {
  if (!this.orderId) {
    this.orderId = 'ORD' + Date.now()
  }
})

export default mongoose.model('Order', orderSchema)
