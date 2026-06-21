import { Schema, model, Document, Types } from 'mongoose'

export interface ILeaderboard extends Document {
  userId: Types.ObjectId
  totalPoints: number
  rank: number
  period: string  // e.g. '2024-W23' (ISO week)
}

const LeaderboardSchema = new Schema<ILeaderboard>(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    totalPoints: { type: Number, default: 0 },
    rank:        { type: Number, default: 0 },
    period:      { type: String, required: true },
  },
  { timestamps: true }
)

LeaderboardSchema.index({ period: 1, totalPoints: -1 })

export const Leaderboard = model<ILeaderboard>('Leaderboard', LeaderboardSchema)
