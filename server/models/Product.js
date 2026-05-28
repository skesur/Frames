import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    price:       { type: Number, required: true },
    description: { type: String, default: '' },
    category:    {
      type: String,
      enum: ['top-sellers', 'new-arrivals', 'round-frames', 'square-frames', 'sunglasses'],
      required: true,
    },
    badge:     { type: String, default: '' },
    rating:    { type: Number, default: 5, min: 1, max: 5 },
    images:    [{ type: String }],
    modelFile: { type: String, default: '' },
    inStock:   { type: Boolean, default: true },
    featured:  { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Product', productSchema)