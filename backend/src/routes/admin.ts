import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { adminOnly } from '../middleware/adminOnly'
import {
  getComplaints, approveComplaint, rejectComplaint, resolveComplaint,
  getUsers, updateUserAdmin,
} from '../controllers/adminController'

const router = Router()

router.use(authenticate, adminOnly)

router.get('/complaints',                  getComplaints)
router.patch('/complaints/:id/approve',    approveComplaint)
router.patch('/complaints/:id/reject',     rejectComplaint)
router.patch('/complaints/:id/resolve',    resolveComplaint)
router.get('/users',                       getUsers)
router.patch('/users/:id/make-admin',      updateUserAdmin)

export default router
