import { Schema, model, Document, Types } from 'mongoose'

interface Exercise {
  name: string
  sets: number
  reps: number
  restSeconds: number
}

export interface IWorkoutPlan extends Document {
  title: string
  description?: string
  createdBy: Types.ObjectId
  exercises: Exercise[]
  durationWeeks: number
}

const ExerciseSchema = new Schema<Exercise>(
  {
    name:        { type: String, required: true },
    sets:        { type: Number, required: true, min: 1 },
    reps:        { type: Number, required: true, min: 1 },
    restSeconds: { type: Number, default: 60 },
  },
  { _id: false }
)

const WorkoutPlanSchema = new Schema<IWorkoutPlan>(
  {
    title:         { type: String, required: true, trim: true },
    description:   { type: String, trim: true },
    createdBy:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
    exercises:     { type: [ExerciseSchema], default: [] },
    durationWeeks: { type: Number, default: 4, min: 1 },
  },
  { timestamps: true }
)

export const WorkoutPlan = model<IWorkoutPlan>('WorkoutPlan', WorkoutPlanSchema)
