import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const app = express()
const PORT = 8000
const MONGO_URI = 'mongodb://localhost:27017/octofit'

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB on port 27017'))
  .catch((err) => console.error('❌ MongoDB connection error:', err))

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'OctoFit Tracker API is running' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`)
})

export default app
