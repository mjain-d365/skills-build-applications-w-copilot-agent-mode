import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
  username: string
  email: string
  password: string
  createdAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
)

export const User = model<IUser>('User', UserSchema)
