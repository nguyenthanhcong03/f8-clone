import bcrypt from 'bcryptjs'
import User from '../models/user.model'
import { CreateUserInput, UpdateUserInput } from '../schemas/user.schema'
import uploadService from './upload.service'

export class UserService {
  async createUser(userData: CreateUserInput['body']) {
    const { name, email, password, avatar, role } = userData

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
      password: hashedPassword,
      avatar,
      role
    })

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  async updateUser(id: number, userData: UpdateUserInput['body']) {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  async getUserByEmail(email: string) {
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ['password'] }
    })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  async getUsersByRole(role: 'admin' | 'student') {
    const users = await User.findAll({
      where: { role },
      attributes: { exclude: ['password'] }
    })
    return users
  }

  async uploadAvatar(id: number, fileBuffer: Buffer) {
    const user = await User.findByPk(id)
    if (!user) {
      throw new Error('User not found')
    }

    // Xóa avatar cũ nếu có
    const currentPublicId = user.getDataValue('avatar_public_id')
    if (currentPublicId) {
      await uploadService.deleteFile(currentPublicId)
    }

    // Upload avatar mới
    const uploadResult = await uploadService.uploadImage(fileBuffer, 'avatars')

    // Cập nhật user với avatar và public_id mới
    await user.update({
      avatar: uploadResult.url,
      avatar_public_id: uploadResult.public_id
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
  }

  async deleteAvatar(id: number) {
    const user = await User.findByPk(id)
    if (!user) {
      throw new Error('User not found')
    }

    const currentPublicId = user.getDataValue('avatar_public_id')
    if (currentPublicId) {
      await uploadService.deleteFile(currentPublicId)
    }

    await user.update({
      avatar: undefined,
      avatar_public_id: undefined
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
  }
}

export default new UserService()
