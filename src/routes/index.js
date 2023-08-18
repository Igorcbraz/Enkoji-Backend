import { Router } from 'express'

const router = Router()

import loginRouter from './login.js'
import collaboratorsRouter from './collaborators.js'

router.use('/login', loginRouter)
router.use('/collaborators', collaboratorsRouter)

export { router }