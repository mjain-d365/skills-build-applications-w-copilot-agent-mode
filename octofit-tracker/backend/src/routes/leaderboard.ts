import { Router, Request, Response } from 'express'
import { Leaderboard } from '../models/Leaderboard'

const router = Router()

// GET /api/leaderboard?period=2024-W23
router.get('/', async (req: Request, res: Response) => {
  try {
    const filter = req.query.period ? { period: req.query.period as string } : {}
    const entries = await Leaderboard.find(filter)
      .populate('userId', 'username email')
      .sort({ totalPoints: -1 })
      .lean()
    res.json(entries)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' })
  }
})

// POST /api/leaderboard
router.post('/', async (req: Request, res: Response) => {
  try {
    const entry = await Leaderboard.create(req.body)
    res.status(201).json(entry)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/leaderboard/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const entry = await Leaderboard.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!entry) return res.status(404).json({ error: 'Entry not found' })
    res.json(entry)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/leaderboard/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const entry = await Leaderboard.findByIdAndDelete(req.params.id)
    if (!entry) return res.status(404).json({ error: 'Entry not found' })
    res.json({ message: 'Entry deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete entry' })
  }
})

export default router
