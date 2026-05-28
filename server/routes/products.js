import { Router } from 'express'
const router = Router()
router.get('/', (req, res) => res.json({ route: 'products', status: 'ready' }))
export default router