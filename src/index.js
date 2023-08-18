import express from 'express'
import { router } from './routes/index.js'
import dotenv from 'dotenv'
import logger from 'logger-endpoints-api'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 8080

dotenv.config()
app.use(express.json())

app.use(cors())

// get the user from header
app.use((req, res, next) => {
  const user = req.headers.authorization

  if (user) {
    req.user = JSON.parse(user)
  }

  next()
})

app.get('/', (req, res) => {
  res.send('Successful response.')
})

app.use(router)

app.use(logger)

app.listen(PORT, () => {
  console.log(`\x1b[33m App listening on port ${PORT}! 🚀 \x1b[0m`);
})