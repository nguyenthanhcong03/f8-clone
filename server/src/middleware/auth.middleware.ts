import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'
import ApiError from '@/utils/ApiError'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: string; role: 'student' | 'admin' } | null // null nếu chưa login
    }
  }
}

interface AuthOptions {
  required?: boolean // bắt buộc login hay không
  roles?: string[] // danh sách role được phép truy cập
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  let token

  // Check for token in cookies first
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken
  }
  // Then check Authorization header as fallback
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Không có access token, vui lòng đăng nhập'
    })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

    const currentUser = await User.findByPk(decoded.user_id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    })

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Người dùng không tồn tại'
      })
    }

    // Add user to request
    req.user = currentUser
    next()
  } catch (error: unknown) {
    res.status(401).json({
      success: false,
      message: 'Lỗi xác thực',
      error: error.message
    })
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
    req.user = { id: decoded.userId, role: decoded.role }
    next()
  } catch (error) {
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
    if (!decoded || !decoded.user_id) {
      throw new ApiError(401, 'Token không hợp lệ')
    }
    // Gắn thông tin người dùng vào request để sử dụng trong các middleware hoặc route tiếp theo
    req.user = { id: decoded.user_id, role: decoded.role }
    next()
  } catch (err) {
    req.user = null // token hỏng thì coi như chưa login
    res.status(401).json({
      success: false,
      message: 'Lỗi xác thực',
      error: error.message
    })
  }
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

export default { verifyToken, checkRole, authRequired, authOptional }
