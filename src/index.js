import express from 'express'
import { router } from './routes/index.js'
import dotenv from 'dotenv'

const app = express()
const PORT = process.env.PORT || 8080

dotenv.config()
app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-type')
  next()
})

app.get('/', (req, res) => {
  res.send('Successful response.')
})

app.use(router)

app.listen(PORT, () => {
  console.log(`\x1b[33m App listening on port ${PORT}! 🚀 \x1b[0m`);
})