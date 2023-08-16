import { Router } from 'express'
import { LoginController } from '../controller/LoginController.js'

const router = Router()
const { handle } = new LoginController()

router.use('/', handle)

export default router