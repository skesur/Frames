import dotenv from 'dotenv'
dotenv.config()

import app           from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 5000

async function start() {
  const connected = await connectDB()
  if (!connected) {
    console.error('Server startup aborted: MongoDB connection failed.')
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`Frames server running on http://localhost:${PORT}`)
  })
}

start()
