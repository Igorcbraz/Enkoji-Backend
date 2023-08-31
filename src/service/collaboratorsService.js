import { prisma } from "../config/database.js"

export class CollaboratorsService {
  async create (collaborator) {
    return await prisma.$transaction(async (t) => {
      const createdCollaborator = await t.collaborators.create({
        data: collaborator
      })

      return createdCollaborator
    })
  }

  async getOne (where) {
    const collaborator = await prisma.collaborators.findUnique({
      where
    })
    
    return collaborator
  }

  async getMany ({ page, limit, where, orderBy }) {
    const collaborators = await prisma.collaborators.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      orderBy
    })

    const count = await prisma.collaborators.count({
      where
    })

    return {
      data: collaborators,
      meta: {
        count,
        page,
        limit
      }
    }
  }

  async update (where, data) {
    return await prisma.$transaction(async (t) => {
      const updatedCollaborator = await t.collaborators.update({
        where,
        data
      })

      return updatedCollaborator
    })
  }

  async remove (where) {
    return await prisma.$transaction(async (t) => {
      const deletedCollaborator = await t.collaborators.delete({
        where
      })

      return deletedCollaborator
    })
  }
}