import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ['user', 'admin'], default: 'user' },
    phone:    { type: String, default: '' },
    address:  { type: String, default: '' },
    pincode:  { type: String, default: '' },
    country:  { type: String, default: '' },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)