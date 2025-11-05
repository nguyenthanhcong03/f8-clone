import jwt from 'jsonwebtoken'

interface UserPayload {
  userId: string
  name?: string
  email?: string
  avatar?: string
  role?: 'admin' | 'student'
}

export const generateAccessToken = (user: UserPayload): string => {
  return jwt.sign(
    {
      userId: user.userId,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role
    } as UserPayload,
    process.env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
    } as jwt.SignOptions
  )
}

export const generateRefreshToken = (user: Pick<UserPayload, 'userId'>): string => {
  return jwt.sign(
    { userId: user.userId },
    process.env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
    } as jwt.SignOptions
  )
}
