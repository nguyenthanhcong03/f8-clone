import bcrypt from 'bcryptjs'
import User from '../models/user.model'
import { CreateUserInput } from '../schemas/user.schema'

export class UserService {
  async createUser(userData: CreateUserInput['body']) {
    const { name, email, password } = userData

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
  }

  async getAllUsers() {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    })
    return users
  }

  async getUserById(id: number) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  async updateUser(id: number, userData: Partial<CreateUserInput['body']>) {
    const user = await User.findByPk(id)
    if (!user) {
      throw new Error('User not found')
    }

    // If password is being updated, hash it
    if (userData.password) {
      const saltRounds = 12
      userData.password = await bcrypt.hash(userData.password, saltRounds)
    }

    await user.update(userData)
    const { password: _, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
  }

  async deleteUser(id: number) {
    const user = await User.findByPk(id)
    if (!user) {
      throw new Error('User not found')
    }
    await user.destroy()
    return { message: 'User deleted successfully' }
  }
}

export default new UserService()
