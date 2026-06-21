import { Schema, model, Document, Types } from 'mongoose'

export interface IActivity extends Document {
  userId: Types.ObjectId
  type: string
  duration: number   // minutes
  distance?: number  // km
  calories?: number
  date: Date
}

const ActivitySchema = new Schema<IActivity>(
  {
    userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type:     { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 0 },
    distance: { type: Number, min: 0 },
    calories: { type: Number, min: 0 },
    date:     { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const Activity = model<IActivity>('Activity', ActivitySchema)
