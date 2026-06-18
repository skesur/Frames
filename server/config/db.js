import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'frames',
      serverSelectionTimeoutMS: 5000,
    })
    console.log(`MongoDB connected: ${conn.connection.host}`)
    return true
  } catch (error) {
    console.error(`MongoDB failed: ${error.message}`)
    return false
  }
}
