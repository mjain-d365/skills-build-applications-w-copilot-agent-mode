import { Router, Request, Response } from 'express'
import { Activity } from '../models/Activity'

const router = Router()

// GET /api/activities
router.get('/', async (_req: Request, res: Response) => {
  try {
    const activities = await Activity.find().populate('userId', 'username email').lean()
    res.json(activities)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activities' })
  }
})

// GET /api/activities/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('userId', 'username email').lean()
    if (!activity) return res.status(404).json({ error: 'Activity not found' })
    res.json(activity)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activity' })
  }
})

// POST /api/activities
router.post('/', async (req: Request, res: Response) => {
  try {
    const activity = await Activity.create(req.body)
    res.status(201).json(activity)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/activities/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!activity) return res.status(404).json({ error: 'Activity not found' })
    res.json(activity)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/activities/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id)
    if (!activity) return res.status(404).json({ error: 'Activity not found' })
    res.json({ message: 'Activity deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete activity' })
  }
})

export default router
