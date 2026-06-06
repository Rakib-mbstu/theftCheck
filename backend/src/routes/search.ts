import { Router } from 'express'
import { searchDevice } from '../controllers/searchController'

const router = Router()

router.get('/', searchDevice)

export default router
