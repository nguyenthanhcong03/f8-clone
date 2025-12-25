import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'
import ApiError from '@/utils/ApiError'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        userId: string
        fullName: string
        username: string
        email: string
        avatar: string
        role: 'student' | 'admin'
      } | null // null nếu chưa login
    }
  }
}

const authRequired = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
    if (!token) {
      throw new ApiError(401, 'Không có token, truy cập bị từ chối')
    }

    // Giải mã và xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload
    if (!decoded || !decoded.userId) {
      throw new ApiError(401, 'Token không hợp lệ')
    }
    // Gắn thông tin người dùng vào request để sử dụng trong các middleware hoặc route tiếp theo
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      fullName: decoded.fullName,
      email: decoded.email,
      avatar: decoded.avatar,
      role: decoded.role
    }
    next()
  } catch {
    throw new ApiError(401, 'Token không hợp lệ hoặc đã hết hạn')
  }
}

const authOptional = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1]

  if (!token) {
    req.user = null // chưa login
    return next()
  }

  try {
    // Giải mã và xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload
    if (!decoded || !decoded.userId) {
      throw new ApiError(401, 'Token không hợp lệ')
    }
    // Gắn thông tin người dùng vào request để sử dụng trong các middleware hoặc route tiếp theo
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      fullName: decoded.fullName,
      email: decoded.email,
      avatar: decoded.avatar,
      role: decoded.role
    }
  } catch {
    req.user = null // token hỏng thì coi như chưa login
  }
  next()
}

const checkRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập chức năng này'
      })
    }

    next()
  }
}

export default { checkRole, authRequired, authOptional }
