import { PrismaClient } from '@prisma/client'
import { compare } from 'bcrypt'

const prisma = new PrismaClient()

export class LoginService {
  async execute({ email, password }) {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      throw new Error('E-mail ou senha incorreta')
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new Error('E-mail ou senha incorreta')
    }

    delete user.password

    return user
  }
}