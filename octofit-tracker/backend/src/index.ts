import express from 'express'
import cors from 'cors'

import { connectDb, dbStatus } from './database'
import userRoutes          from './routes/users'
import activityRoutes      from './routes/activities'
import leaderboardRoutes   from './routes/leaderboard'
import teamRoutes          from './routes/teams'
import workoutRoutes       from './routes/workoutPlans'

const app  = express()
const PORT = Number(process.env.PORT) || 8000

// Middleware
app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json())

// Connect to MongoDB
connectDb().catch((err) => {
  console.error('Failed to connect to MongoDB:', err)
  process.exit(1)
})

// Routes
app.use('/api/users',         userRoutes)
app.use('/api/activities',    activityRoutes)
app.use('/api/leaderboard',   leaderboardRoutes)
app.use('/api/teams',         teamRoutes)
app.use('/api/workout-plans', workoutRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'OctoFit Tracker API is running',
    db: dbStatus(),
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`)
})

export default app
