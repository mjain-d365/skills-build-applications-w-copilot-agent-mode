/**
 * database.ts
 * Robust Mongoose connection module for OctoFit Tracker.
 *
 * Fixes over the original connection.ts:
 *  1. isConnected flag is set immediately after await mongoose.connect()
 *     (not relying solely on the async 'connected' event).
 *  2. Event listeners are registered only once via .once() to prevent
 *     duplicate handlers on repeated calls.
 *  3. bufferCommands disabled so queries fail fast instead of queuing
 *     silently when MongoDB is unreachable.
 *  4. Graceful shutdown helpers exported for process signals.
 */
import mongoose from 'mongoose'

export const MONGO_URI =
  process.env.MONGO_URI ?? 'mongodb://localhost:27017/octofit'

// Disable silent query buffering — fail fast if not connected
mongoose.set('bufferCommands', false)

let _connected = false
let _listenersRegistered = false

function registerListeners(): void {
  if (_listenersRegistered) return
  _listenersRegistered = true

  mongoose.connection.once('connected', () => {
    _connected = true
    console.log('✅ MongoDB connected — octofit @ ' + MONGO_URI)
  })

  mongoose.connection.once('disconnected', () => {
    _connected = false
    console.warn('⚠️  MongoDB disconnected')
  })

  mongoose.connection.on('reconnected', () => {
    _connected = true
    console.log('🔄 MongoDB reconnected')
  })

  mongoose.connection.on('error', (err: Error) => {
    _connected = false
    console.error('❌ MongoDB error:', err.message)
  })
}

/**
 * Connect to MongoDB.
 * Safe to call multiple times — subsequent calls are no-ops if already connected.
 */
export async function connectDb(): Promise<void> {
  // Already open (readyState 1 = connected)
  if (mongoose.connection.readyState === 1) return

  registerListeners()

  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // fail fast if Mongo unreachable
  })

  // Set flag synchronously after the promise resolves
  _connected = true
}

/**
 * Return the current connection status.
 * Used by the /api/health endpoint.
 */
export function dbStatus(): 'connected' | 'disconnected' {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}

/**
 * Gracefully close the Mongoose connection.
 * Call on SIGTERM / SIGINT.
 */
export async function disconnectDb(): Promise<void> {
  if (mongoose.connection.readyState === 0) return
  await mongoose.disconnect()
  _connected = false
  console.log('🛑 MongoDB connection closed')
}

// Auto-close on process termination
process.on('SIGINT',  () => disconnectDb().then(() => process.exit(0)))
process.on('SIGTERM', () => disconnectDb().then(() => process.exit(0)))

export { _connected as isConnected }
