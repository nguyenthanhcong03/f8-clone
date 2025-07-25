import jwt from 'jsonwebtoken'

interface UserPayload {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  role?: 'admin' | 'student'
}

export const generateAccessToken = (user: UserPayload): string => {
  return jwt.sign(
    {
      id: user.id,
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

export const generateRefreshToken = (user: Pick<UserPayload, 'id'>): string => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
    } as jwt.SignOptions
  )
}
