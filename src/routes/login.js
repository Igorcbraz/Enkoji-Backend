import { Router } from 'express'
import { LoginController } from '../controller/LoginController.js'

const router = Router()
const { handle } = new LoginController()

router.post('/', handle)

export default router