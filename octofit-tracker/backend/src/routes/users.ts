import { Router, Request, Response } from 'express'
import { User } from '../models/User'

const router = Router()

// GET /api/users
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password').lean()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// GET /api/users/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean()
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// POST /api/users
router.post('/', async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body)
    const { password: _pw, ...safe } = user.toObject()
    res.status(201).json(safe)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/users/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password').lean()
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/users/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

export default router
