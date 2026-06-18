import dotenv from 'dotenv'
dotenv.config()

import app           from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 5000

async function start() {
  app.listen(PORT, () => {
    console.log(`Frames server running on http://localhost:${PORT}`)
  })

  await connectDB()
}

start()
