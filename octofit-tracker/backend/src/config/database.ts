import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/octofit_db'

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(MONGO_URI)
}

export default mongoose
