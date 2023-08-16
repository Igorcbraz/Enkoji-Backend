import { Router } from 'express'

const router = Router()

import loginRouter from './login.js'

router.post('/login', loginRouter)

export { router }