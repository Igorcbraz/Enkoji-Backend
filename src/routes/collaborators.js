import { Router } from 'express'
import { CollaboratorsController } from '../controller/collaboratorsController.js'

const router = Router()
const { 
  getOne,
  getMany,
  create,
  update,
  remove
 } = new CollaboratorsController()

router.get('/', getMany)
router.get('/:id', getOne)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', remove)

export default router