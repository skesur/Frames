import { Router } from 'express'
const router = Router()
router.get('/', (req, res) => res.json({ route: 'auth', status: 'ready' }))
export default router