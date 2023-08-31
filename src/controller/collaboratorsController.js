import { CollaboratorsService } from '../service/collaboratorsService.js'
import { cleanObject } from '../utils/cleanObject.js'

export class CollaboratorsController {
  async getOne(request, response) {
    const { id } = request.params

    if (!id) {
      return response.status(400).json({ message: 'ID é obrigatório' })
    }

    try {
      const collaboratorService = new CollaboratorsService()
      const collaborator = await collaboratorService.getOne({ collaborator_id: Number(id) })

      if (!collaborator) {
        return response.status(400).json({ message: 'Colaborador não encontrado' })
      }

      return response.status(200).json(collaborator)
    } catch (error) {
      console.error(error)
      return response.status(400).json({ message: error.message })
    }
  }

  async getMany(request, response) {
    const { page = 1, limit = 10, status, user_id, filter } = request.query
    const availableFilters = ['firstname', 'lastname', 'email', 'contact']

    if (!user_id || !status) {
      return response.status(400).json({ message: 'ID do usuário e status são obrigatórios' })
    }

    const where = { ...cleanObject(request.query) }
    delete where.page
    delete where.limit

    if (filter) {
      where.OR = availableFilters.reduce((result, availableFilter) => {
        result.push({ [availableFilter]: { contains: filter, mode: 'insensitive' } })
        console.log(result)
        return result
      }, [])
      delete where.filter
    }

    if (availableFilters.some(filter => where[filter])) {
      where.AND = availableFilters.reduce((result, filter) => {
        if (where[filter]) {
          result.push({ [filter]: { search: `%${where[filter]}%` } })
        }
        delete where[filter]
        return result
      }, [])
    }

    const whereFormatTypes = {
      ...where,
      user_id: Number(where.user_id)
    }

    try {
      const collaboratorService = new CollaboratorsService()
      const { data, meta } = await collaboratorService.getMany({
        page: Number(page),
        limit: Number(limit),
        where: whereFormatTypes,
        orderBy: [{ collaborator_id: 'desc' }]
      })

      return response.status(200).json({ collaborators: data, meta })
    } catch (error) {
      console.error(error)
      return response.status(400).json({ message: error.message })
    }
  }

  async create(request, response) {
    const { user_id } = request.user
    const { name, email } = request.body

    if (!name) {
      return response.status(400).json({ message: 'Nome é obrigatório' })
    }

    try {
      const collaboratorService = new CollaboratorsService()

      if (email) {
        const collaboratorAlreadyExists = await collaboratorService.getOne({
          user_id_email: {
            user_id,
            email
          }
        })
  
        if (collaboratorAlreadyExists) {
          return response.status(400).json({ message: 'Já existe um colaborador com esse e-mail' })
        }
      }

      const firstName = name.split(' ')[0]
      const lastName = name.replace(firstName, '').trim()

      const data = {
        ...request.body,
        user_id,
        firstname: name.split(' ')[0],
        lastname: lastName || '',
        status: 'ACTIVE'
      }

      delete data.name

      const cleanData = cleanObject(data)

      const dataFormattedTypes = {
        ...cleanData,
        payment: parseFloat(cleanData.payment),
      }

      const collaborator = await collaboratorService.create(dataFormattedTypes)

      return response.status(200).json(collaborator) 
    } catch (error) {
      console.error(error)
      return response.status(400).json({ message: error.message })
    }
  }

  async update(request, response) {
    const { user_id } = request.user
    const { id } = request.params

    if (!id) {
      return response.status(400).json({ message: 'ID é obrigatório' })
    }

    try {
      const collaboratorService = new CollaboratorsService()
      const collaborator = await collaboratorService.getOne({ collaborator_id: Number(id) })

      if (!collaborator) {
        return response.status(400).json({ message: 'Colaborador não encontrado' })
      }

      const data = cleanObject(request.body)
    
      const difference = Object.keys(data).reduce((result, key) => {
        if (collaborator[key] !== data[key]) {
          result[key] = data[key]
        }
        return result
      }, {})

      if (difference.email) {
        const collaboratorEmailAlreadyExists = await collaboratorService.getOne({ 
          user_id_email: {
            user_id,
            email: difference.email
          }
         })

        if (collaboratorEmailAlreadyExists) {
          return response.status(400).json({ message: 'Já existe um colaborador com esse e-mail' })
        }
      }

      if (difference.name) {
        difference.firstname = difference.name.split(' ')[0]
        difference.lastname = difference.name.replace(difference.name.split(' ')[0], '').trim()
      }

      if (difference.payment) {
        difference.payment = parseFloat(difference.payment)
      }

      delete difference.name

      const updatedCollaborator = await collaboratorService.update({ collaborator_id: Number(id) }, difference)

      return response.status(200).json(updatedCollaborator)
    } catch (error) {
      console.error(error)
      return response.status(400).json({ message: error.message })
    }
  }

  async remove(request, response) {
    const { id } = request.params

    if (!id) {
      return response.status(400).json({ message: 'ID é obrigatório' })
    }

    try {
      const collaboratorService = new CollaboratorsService()
      const collaborator = await collaboratorService.getOne({ collaborator_id: Number(id) })

      if (!collaborator) {
        return response.status(400).json({ message: 'Colaborador não encontrado' })
      }

      await collaboratorService.remove({ collaborator_id: Number(id) })

      return response.status(200).json({ message: 'Colaborador removido com sucesso' })
    } catch (error) {
      console.error(error)
      return response.status(400).json({ message: error.message })
    }
  }
}