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
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const currentUser = await User.findByPk(decoded._id, {
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
  } catch (error: Error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token expired',
        expired: true
      })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalid'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Lỗi xác thực',
      error: error.message
    })
  }
}

/**
 * Check if user has one of the allowed roles
 * @param {...string} allowedRoles - Roles that are allowed to access
 */
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
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

module.exports = { verifyToken, checkRole }
