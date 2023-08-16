import { LoginService } from '../service/loginService.js'

export class LoginController {
  async handle(request, response) {
    const { email, password } = request.body

    if (!email || !password) {
      return response.status(400).json({ message: 'Email and password are required' })
    }

    try {
      const loginService = new LoginService()
      const user = await loginService.execute(request.body)

      return response.status(200).json(user) 
    } catch (error) {
      console.error(error)
      return response.status(400).json({ message: error.message })
    }
  }
}