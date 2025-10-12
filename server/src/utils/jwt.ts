import jwt from 'jsonwebtoken'

interface UserPayload {
  user_id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role?: 'admin' | 'student'
}

export const generateAccessToken = (user: UserPayload): string => {
  return jwt.sign(
    {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role
    } as UserPayload,
    process.env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
    } as jwt.SignOptions
  )
}

export const generateRefreshToken = (user: Pick<UserPayload, 'user_id'>): string => {
  return jwt.sign(
    { id: user.user_id },
    process.env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
    } as jwt.SignOptions
  )
}
