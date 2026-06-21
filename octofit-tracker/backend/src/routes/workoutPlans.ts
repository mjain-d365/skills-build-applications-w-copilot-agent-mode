import { Router, Request, Response } from 'express'
import { WorkoutPlan } from '../models/WorkoutPlan'

const router = Router()

// GET /api/workout-plans
router.get('/', async (_req: Request, res: Response) => {
  try {
    const plans = await WorkoutPlan.find().populate('createdBy', 'username email').lean()
    res.json(plans)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workout plans' })
  }
})

// GET /api/workout-plans/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id).populate('createdBy', 'username email').lean()
    if (!plan) return res.status(404).json({ error: 'Workout plan not found' })
    res.json(plan)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workout plan' })
  }
})

// POST /api/workout-plans
router.post('/', async (req: Request, res: Response) => {
  try {
    const plan = await WorkoutPlan.create(req.body)
    res.status(201).json(plan)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/workout-plans/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const plan = await WorkoutPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!plan) return res.status(404).json({ error: 'Workout plan not found' })
    res.json(plan)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/workout-plans/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const plan = await WorkoutPlan.findByIdAndDelete(req.params.id)
    if (!plan) return res.status(404).json({ error: 'Workout plan not found' })
    res.json({ message: 'Workout plan deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete workout plan' })
  }
})

export default router
