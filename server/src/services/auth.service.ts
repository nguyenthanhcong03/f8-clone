import bcrypt from 'bcryptjs'
import User from '../models/user.model'
import { LoginAccountInput, RegisterAccountInput } from '../schemas/auth.schema'
import ApiError from '../utils/ApiError'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'
import jwt from 'jsonwebtoken'

const register = async (userData: RegisterAccountInput['body']) => {
  const { name, email, password } = userData

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
  console.log('👉check: ', loginData)

  const currentPassword = user.password

  // Kiểm tra mật khẩu
  const isMatch = await bcrypt.compare(password, currentPassword)
  if (!isMatch) {
    throw new ApiError(401, 'Thông tin đăng nhập không hợp lệ')
  }

  // Tạo user payload cho JWT
  const userPayload = {
    userId: user.userId,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    avatarPublicId: user.avatarPublicId,
    role: user.role
  }

  // Tạo tokens
  const accessToken = generateAccessToken(userPayload)
  const refreshToken = generateRefreshToken(userPayload)

  return {
    user: {
      id: user.userId,
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

const changePassword = async (id: string, currentPassword: string, newPassword: string) => {
  const user = await User.findByPk(id)
  if (!user) {
    throw new ApiError(404, 'Người dùng không tồn tại')
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.getDataValue('password'))
  if (!isCurrentPasswordValid) {
    throw new ApiError(400, 'Mật khẩu hiện tại không đúng')
  }

  // Hash new password
  const saltRounds = 12
  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

  await user.update({ password: hashedNewPassword })
  return { message: 'Thay đổi mật khẩu thành công' }
}

const refreshToken = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as jwt.JwtPayload
  const user = await User.findByPk(decoded.userId, {
    attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
  })

  if (!user) {
    throw new ApiError(401, 'Người dùng không tồn tại')
  }

  const newAccessToken = generateAccessToken({
    userId: user.userId,
    role: user.role
  })

  return newAccessToken
}

const getProfile = async (userId: string) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
  })
  if (!user) {
    throw new ApiError(404, 'Người dùng không tồn tại')
  }
  return user
}

const updateProfile = async (
  userId: string,
  updateData: { name?: string; phone?: string },
  file?: Express.Multer.File
) => {
  const user = await User.findByPk(userId)
  if (!user) {
    throw new ApiError(404, 'Người dùng không tồn tại')
  }
  const { name, phone } = updateData

  // Cập nhật avatar nếu có file
  if (file) {
    user.avatar = file.path // Giả sử bạn lưu đường dẫn file trong trường avatar
  }
  if (name) {
    user.name = name
  }
  if (phone) {
    user.phone = phone
  }
  await user.save()
  return user
}

export default {
  register,
  login,
  changePassword,
  refreshToken,
  getProfile,
  updateProfile
}
