import { Blog, Course, Lesson, Section } from '@/models'
import { deleteImage, uploadImage } from '@/utils/cloudinary'
import bcrypt from 'bcryptjs'
import User from '../models/user.model'
import { CreateUserInput, UpdateUserInput } from '../schemas/user.schema'

export const userService = {
  async createUser(userData: CreateUserInput['body']) {
    const { fullName, username, email, password, avatar, role } = userData

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
      fullName,
      username,
      email,
      password: hashedPassword,
      avatar,
      role
    })

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
  },

  async getAllUsers() {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    })
    return users
  },

  async getUserById(id: number) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  },

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
  },

  async deleteUser(id: number) {
    const user = await User.findByPk(id)
    if (!user) {
      throw new Error('User not found')
    }
    await user.destroy()
    return { message: 'User deleted successfully' }
  },

  async getUserByEmail(email: string) {
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ['password'] }
    })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  },

  async getUsersByRole(role: 'admin' | 'student') {
    const users = await User.findAll({
      where: { role },
      attributes: { exclude: ['password'] }
    })
    return users
  },

  async uploadAvatar(id: number, fileBuffer: Buffer) {
    const user = await User.findByPk(id)
    if (!user) {
      throw new Error('User not found')
    }

    // Xóa avatar cũ nếu có
    const currentPublicId = user.getDataValue('avatar_public_id')
    if (currentPublicId) {
      await deleteImage(currentPublicId)
    }

    // Upload avatar mới
    const uploadResult = await uploadImage(fileBuffer, 'avatars')

    // Cập nhật user với avatar và public_id mới
    await user.update({
      avatar: uploadResult.url,
      avatar_public_id: uploadResult.public_id
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
  },
  async deleteAvatar(id: number) {
    const user = await User.findByPk(id)
    if (!user) {
      throw new Error('User not found')
    }

    const currentPublicId = user.getDataValue('avatar_public_id')
    if (currentPublicId) {
      await deleteImage(currentPublicId)
    }

    await user.update({
      avatar: undefined,
      avatar_public_id: undefined
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
  },

  async getPublicProfileByUsername(username: string) {
    const user = await User.findOne({
      where: { username },
      attributes: ['userId', 'fullName', 'username', 'avatar', 'createdAt'],
      include: [
        {
          model: Course,
          as: 'enrolledCourses',
          through: { attributes: [] },
          include: [
            { model: Section, as: 'sections', include: [{ model: Lesson, as: 'lessons' }] },
            { model: User, as: 'creator' }
          ]
        },
        {
          model: Blog,
          as: 'blogs',
          include: [{ model: User, as: 'author' }]
        }
      ]
    })
    if (!user) {
      throw new Error('Người dùng không tồn tại')
    }

    console.log('user :>> ', user.toJSON())
    return user
  }
}

export default userService
