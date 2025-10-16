import { Request, Response } from 'express'
import authService from '../services/auth.service'
import catchAsync from '@/utils/catchAsync'
import ApiError from '@/utils/ApiError'

const registerAccount = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.register(req.body)
  res.status(201).json({
    success: true,
    data: user,
    message: 'Tạo tài khoản thành công'
  })
})

const loginAccount = catchAsync(async (req: Request, res: Response) => {
  const response = await authService.login(req.body)
  // // Lưu accessToken vào cookie
  // res.cookie('accessToken', response.accessToken, {
  //   httpOnly: true
  //   // secure: true,
  //   // sameSite: "Strict",
  //   // maxAge: process.env.ACCESS_TOKEN_COOKIE_EXPIRES,
  // })

  // Lưu refreshToken vào cookie
  res.cookie('refreshToken', response.refreshToken, {
    httpOnly: true,
    // secure: true,
    // sameSite: 'Strict',
    maxAge: process.env.REFRESH_TOKEN_COOKIE_EXPIRES
  })

  res.status(200).json({
    success: true,
    message: 'Đăng nhập thành công',
    data: {
      accessToken: response.accessToken,
      // refreshToken: response.refreshToken,
      user: response.user
    }
  })
})

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id)
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required'
    })
  }

  const result = await authService.changePassword(userId, currentPassword, newPassword)
  res.status(200).json({
    success: true,
    message: result.message
  })
})

const logout = catchAsync(async (req: Request, res: Response) => {
  // Xoá cookie refreshToken
  res.clearCookie('refreshToken', {
    httpOnly: true
    // secure: true,
    // sameSite: "Strict",
    // maxAge: process.env.REFRESH_TOKEN_COOKIE_EXPIRES,
  })
  res.status(200).json({
    success: true,
    message: 'Đăng xuất thành công'
  })
})

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  console.log('Req.cookies:', req.cookies)
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'No refresh token provided'
    })
  }
  const newTokens = await authService.refreshToken(refreshToken)

  res.status(200).json({
    success: true,
    message: 'Refresh token thành công',
    data: {
      accessToken: newTokens.accessToken,
      user: newTokens.user
    }
  })
})

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  if (!user) {
    throw new ApiError(401, 'Unauthorized')
  }
  res.status(200).json({
    success: true,
    data: user
  })
})

export default {
  registerAccount,
  loginAccount,
  logout,
  changePassword,
  refreshToken,
  getCurrentUser
}
