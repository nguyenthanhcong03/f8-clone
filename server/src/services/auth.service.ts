import bcrypt from 'bcryptjs'
import User from '../models/user.model'
import { LoginAccountInput, RegisterAccountInput } from '../schemas/auth.schema'
import ApiError from '../utils/ApiError'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'
import jwt from 'jsonwebtoken'

const register = async (userData: RegisterAccountInput['body']) => {
  const { name, email, password } = userData
  console.log('userData:', userData)

  // Kiểm tra xem người dùng đã tồn tại chưa
  const existingUser = await User.findOne({ where: { email } })
  if (existingUser) {
    throw new ApiError(409, 'Email đã được sử dụng')
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
  console.log('user:', user)

  // Loại bỏ password khỏi response
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user.toJSON()
  return userWithoutPassword
}

const login = async (loginData: LoginAccountInput['body']) => {
  const { email, password } = loginData

  // Tìm người dùng
  const user = await User.findOne({ where: { email } })
  if (!user) {
    throw new ApiError(401, 'Thông tin đăng nhập không hợp lệ')
  }

  const currentPassword = user.password
  // const currentPassword = user.getDataValue('password')
  console.log('đến đây:', currentPassword)

  // Kiểm tra mật khẩu
  const isMatch = await bcrypt.compare(password, currentPassword)
  if (!isMatch) {
    throw new ApiError(401, 'Thông tin đăng nhập không hợp lệ')
  }

  // Tạo user payload cho JWT
  const userPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    avatar_public_id: user.avatar_public_id,
    role: user.role
  }

  // Tạo tokens
  const accessToken = generateAccessToken(userPayload)
  const refreshToken = generateRefreshToken(userPayload)

  return {
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      avatar: user.avatar,
      role: user.role
    },
    accessToken,
    refreshToken
  }
}

const changePassword = async (id: number, currentPassword: string, newPassword: string) => {
  const user = await User.findByPk(id)
  if (!user) {
    throw new Error('User not found')
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.getDataValue('password'))
  if (!isCurrentPasswordValid) {
    throw new Error('Current password is incorrect')
  }

  // Hash new password
  const saltRounds = 12
  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

  await user.update({ password: hashedNewPassword })
  return { message: 'Password changed successfully' }
}

const refreshToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token is required')
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string)
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    })
    if (!user) {
      throw new ApiError(401, 'User not found')
    }
    // Create new tokens
    const newAccessToken = generateAccessToken({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role
    })
    return {
      accessToken: newAccessToken,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      }
    }
  } catch (error) {
    console.log('Error refreshing token:', error)
    throw new ApiError(401, 'Invalid refresh token')
  }
}

export default {
  register,
  login,
  changePassword,
  refreshToken
}
