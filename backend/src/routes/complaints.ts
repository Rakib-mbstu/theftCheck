import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { submitComplaint, getMyComplaints } from '../controllers/complaintsController'

const router = Router()

router.use(authenticate)

router.post('/',     submitComplaint)
router.get('/mine',  getMyComplaints)

export default router
