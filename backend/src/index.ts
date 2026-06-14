import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import searchRoutes from './routes/search'
import adminRoutes from './routes/admin'
import complaintsRoutes from './routes/complaints'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/complaints', complaintsRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
