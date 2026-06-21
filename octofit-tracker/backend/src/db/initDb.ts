/**
 * OctoFit DB initialisation & population script.
 * Connects to MongoDB, creates the `octofit` database, and seeds
 * all five collections with realistic sample data.
 *
 * Usage:
 *   npx ts-node src/db/initDb.ts
 *
 * Environment variable (optional):
 *   MONGO_URI=mongodb://localhost:27017/octofit
 */
import mongoose from 'mongoose'
import { User }        from '../models/User'
import { Activity }    from '../models/Activity'
import { Team }        from '../models/Team'
import { Leaderboard } from '../models/Leaderboard'
import { WorkoutPlan } from '../models/WorkoutPlan'

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/octofit'

// ─── helper ────────────────────────────────────────────────────────────────
function isoWeek(d: Date): string {
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7))
  const year = tmp.getUTCFullYear()
  const week = Math.ceil(((+tmp - +new Date(Date.UTC(year, 0, 1))) / 86400000 + 1) / 7)
  return `${year}-W${String(week).padStart(2, '0')}`
}

// ─── data ──────────────────────────────────────────────────────────────────
const now = new Date()
const currentPeriod = isoWeek(now)

const USERS = [
  { username: 'octocat',   email: 'octocat@github.com',    password: 'hashed_pw_octocat'   },
  { username: 'monalisa',  email: 'monalisa@github.com',   password: 'hashed_pw_monalisa'  },
  { username: 'hubot',     email: 'hubot@github.com',      password: 'hashed_pw_hubot'     },
  { username: 'defunkt',   email: 'defunkt@github.com',    password: 'hashed_pw_defunkt'   },
  { username: 'mojombo',   email: 'mojombo@github.com',    password: 'hashed_pw_mojombo'   },
]

const WORKOUT_PLANS_SEED = [
  {
    title: 'Beginner 5K Plan',
    description: 'Build up to running 5K in 4 weeks',
    durationWeeks: 4,
    exercises: [
      { name: 'Easy Jog',      sets: 1, reps: 1,  restSeconds: 0  },
      { name: 'Walk Interval', sets: 3, reps: 5,  restSeconds: 60 },
      { name: 'Cool-down',     sets: 1, reps: 10, restSeconds: 30 },
    ],
  },
  {
    title: 'Intermediate Strength Circuit',
    description: 'Full-body strength training circuit, 3 days/week',
    durationWeeks: 6,
    exercises: [
      { name: 'Push-ups',      sets: 3, reps: 15, restSeconds: 45 },
      { name: 'Bodyweight Squat', sets: 3, reps: 20, restSeconds: 45 },
      { name: 'Plank Hold',    sets: 3, reps: 1,  restSeconds: 60 },
      { name: 'Lunges',        sets: 3, reps: 12, restSeconds: 45 },
    ],
  },
  {
    title: 'Swim Endurance Builder',
    description: 'Increase open-water swim distance over 8 weeks',
    durationWeeks: 8,
    exercises: [
      { name: 'Warm-up Laps',  sets: 1, reps: 4,  restSeconds: 30 },
      { name: 'Freestyle',     sets: 4, reps: 6,  restSeconds: 90 },
      { name: 'Kick Drills',   sets: 2, reps: 4,  restSeconds: 60 },
    ],
  },
]

// ─── init ──────────────────────────────────────────────────────────────────
async function initDb() {
  console.log(`\n🔌 Connecting to ${MONGO_URI} …`)
  await mongoose.connect(MONGO_URI)
  console.log('✅ Connected to MongoDB — database: octofit')

  // ── wipe existing collections ──
  const collections = [
    User, Activity, Team, Leaderboard, WorkoutPlan,
  ] as mongoose.Model<any>[]

  await Promise.all(collections.map((m) => m.deleteMany({})))
  console.log('🗑️  Cleared all collections')

  // ── ensure indexes are in sync ──
  await Promise.all(collections.map((m) => m.syncIndexes()))
  console.log('🔑 Indexes synced')

  // ── users ──
  const users = await User.insertMany(USERS)
  console.log(`👤 Inserted ${users.length} users`)

  // ── workout plans (linked to users as creators) ──
  const plans = await WorkoutPlan.insertMany(
    WORKOUT_PLANS_SEED.map((p, i) => ({ ...p, createdBy: users[i % users.length]._id }))
  )
  console.log(`💪 Inserted ${plans.length} workout plans`)

  // ── activities (a handful per user) ──
  const activityTypes = ['Running', 'Cycling', 'Swimming', 'Hiking', 'Yoga']
  const activitiesData = users.flatMap((u, ui) =>
    activityTypes.map((type, ti) => ({
      userId:   u._id,
      type,
      duration: 20 + (ui + ti) * 5,          // 20–60 min
      distance: parseFloat((1 + (ui + ti) * 1.5).toFixed(1)),
      calories: 150 + (ui + ti) * 40,
      date:     new Date(now.getTime() - ti * 86400000), // spread over past days
    }))
  )
  const activities = await Activity.insertMany(activitiesData)
  console.log(`🏃 Inserted ${activities.length} activities`)

  // ── teams ──
  const teams = await Team.insertMany([
    {
      name: 'Octo Runners',
      description: 'Running enthusiasts across GitHub',
      members:   [users[0]._id, users[1]._id, users[3]._id],
      createdBy: users[0]._id,
    },
    {
      name: 'Swim Squad',
      description: 'Open-water & pool swimmers',
      members:   [users[2]._id, users[4]._id],
      createdBy: users[2]._id,
    },
    {
      name: 'Cycle Crew',
      description: 'Road & trail cycling group',
      members:   [users[1]._id, users[3]._id, users[4]._id],
      createdBy: users[3]._id,
    },
  ])
  console.log(`👥 Inserted ${teams.length} teams`)

  // ── leaderboard ──
  const pointsBase = [1200, 980, 850, 720, 610]
  const leaderboard = await Leaderboard.insertMany(
    users.map((u, i) => ({
      userId:      u._id,
      totalPoints: pointsBase[i],
      rank:        i + 1,
      period:      currentPeriod,
    }))
  )
  console.log(`🏆 Inserted ${leaderboard.length} leaderboard entries (period: ${currentPeriod})`)

  // ── summary ──
  console.log('\n📊 Database summary:')
  console.log(`   users         : ${await User.countDocuments()}`)
  console.log(`   activities    : ${await Activity.countDocuments()}`)
  console.log(`   teams         : ${await Team.countDocuments()}`)
  console.log(`   leaderboard   : ${await Leaderboard.countDocuments()}`)
  console.log(`   workout_plans : ${await WorkoutPlan.countDocuments()}`)

  await mongoose.disconnect()
  console.log('\n🎉 OctoFit DB initialisation complete!')
}

initDb().catch((err) => { console.error('\n❌ initDb failed:', err); process.exit(1) })
