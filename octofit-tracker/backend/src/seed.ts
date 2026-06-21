/**
 * Seed script — populates the database with sample data.
 * Run with:  npx ts-node src/seed.ts
 */
import mongoose from 'mongoose'
import { User }        from './models/User'
import { Activity }    from './models/Activity'
import { Team }        from './models/Team'
import { Leaderboard } from './models/Leaderboard'
import { WorkoutPlan } from './models/WorkoutPlan'

const MONGO_URI = 'mongodb://localhost:27017/octofit'

async function seed() {
  await mongoose.connect(MONGO_URI)
  console.log('✅ Connected to MongoDB')

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Activity.deleteMany({}),
    Team.deleteMany({}),
    Leaderboard.deleteMany({}),
    WorkoutPlan.deleteMany({}),
  ])

  // Users
  const users = await User.insertMany([
    { username: 'octocat',   email: 'octocat@github.com',   password: 'hashed_pw_1' },
    { username: 'monalisa',  email: 'monalisa@github.com',  password: 'hashed_pw_2' },
    { username: 'hubot',     email: 'hubot@github.com',     password: 'hashed_pw_3' },
  ])
  console.log(`👤 Seeded ${users.length} users`)

  // Activities
  const activities = await Activity.insertMany([
    { userId: users[0]._id, type: 'Running',  duration: 30, distance: 5.0,  calories: 300, date: new Date() },
    { userId: users[1]._id, type: 'Cycling',  duration: 45, distance: 20.0, calories: 450, date: new Date() },
    { userId: users[2]._id, type: 'Swimming', duration: 60, distance: 2.0,  calories: 500, date: new Date() },
  ])
  console.log(`🏃 Seeded ${activities.length} activities`)

  // Teams
  const teams = await Team.insertMany([
    { name: 'Octo Runners',  description: 'Running enthusiasts', members: [users[0]._id, users[1]._id], createdBy: users[0]._id },
    { name: 'Swim Squad',    description: 'Open water swimmers',  members: [users[2]._id],               createdBy: users[2]._id },
  ])
  console.log(`👥 Seeded ${teams.length} teams`)

  // Leaderboard
  const period = new Date().toISOString().slice(0, 7) // e.g. '2024-06'
  const lb = await Leaderboard.insertMany([
    { userId: users[0]._id, totalPoints: 1200, rank: 1, period },
    { userId: users[1]._id, totalPoints: 980,  rank: 2, period },
    { userId: users[2]._id, totalPoints: 850,  rank: 3, period },
  ])
  console.log(`🏆 Seeded ${lb.length} leaderboard entries`)

  // Workout Plans
  const plans = await WorkoutPlan.insertMany([
    {
      title: 'Beginner 5K Plan',
      description: 'Build up to running 5K in 4 weeks',
      createdBy: users[0]._id,
      durationWeeks: 4,
      exercises: [
        { name: 'Jog',       sets: 1, reps: 1, restSeconds: 0 },
        { name: 'Stretches', sets: 1, reps: 10, restSeconds: 30 },
      ],
    },
  ])
  console.log(`💪 Seeded ${plans.length} workout plans`)

  await mongoose.disconnect()
  console.log('🎉 Seed complete!')
}

seed().catch((err) => { console.error(err); process.exit(1) })
