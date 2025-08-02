import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'

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

    const currentUser = await User.findByPk(decoded.id, {
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

export default { verifyToken, checkRole }
