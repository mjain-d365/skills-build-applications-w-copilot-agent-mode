import { Router, Request, Response } from 'express'
import { Team } from '../models/Team'

const router = Router()

// GET /api/teams
router.get('/', async (_req: Request, res: Response) => {
  try {
    const teams = await Team.find().populate('members createdBy', 'username email').lean()
    res.json(teams)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch teams' })
  }
})

// GET /api/teams/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id).populate('members createdBy', 'username email').lean()
    if (!team) return res.status(404).json({ error: 'Team not found' })
    res.json(team)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch team' })
  }
})

// POST /api/teams
router.post('/', async (req: Request, res: Response) => {
  try {
    const team = await Team.create(req.body)
    res.status(201).json(team)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/teams/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!team) return res.status(404).json({ error: 'Team not found' })
    res.json(team)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/teams/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id)
    if (!team) return res.status(404).json({ error: 'Team not found' })
    res.json({ message: 'Team deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete team' })
  }
})

export default router
