import { prisma } from '../config/database.js'
import { compare } from 'bcrypt'

export class LoginService {
  async execute({ email, password }) {
    const user = await prisma.users.findUnique({
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