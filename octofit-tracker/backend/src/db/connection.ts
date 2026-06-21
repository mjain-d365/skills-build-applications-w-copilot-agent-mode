/**
 * Lightweight connection helper used by the Express server.
 * Handles reconnect logic and surfaces a `db` instance for healthchecks.
 */
import mongoose from 'mongoose'

export const MONGO_URI =
  process.env.MONGO_URI ?? 'mongodb://localhost:27017/octofit'

let isConnected = false

export async function connectDb(): Promise<void> {
  if (isConnected) return

  mongoose.connection.on('connected', () => {
    isConnected = true
    console.log('✅ MongoDB connected — octofit')
  })

  mongoose.connection.on('disconnected', () => {
    isConnected = false
    console.warn('⚠️  MongoDB disconnected')
  })

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err)
  })

  await mongoose.connect(MONGO_URI)
}

export function dbStatus(): 'connected' | 'disconnected' {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}
