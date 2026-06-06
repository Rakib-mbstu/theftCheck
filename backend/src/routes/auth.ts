import { Router } from 'express'
import { googleLogin, logout } from '../controllers/authController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/google', googleLogin)
router.post('/logout', authenticate, logout)

export default router
