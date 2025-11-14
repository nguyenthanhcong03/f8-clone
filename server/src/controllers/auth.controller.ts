import { Request, Response } from 'express'
import authService from '../services/auth.service'
import catchAsync from '@/utils/catchAsync'
import ApiError from '@/utils/ApiError'
import { responseHandler } from '@/utils/responseHandler'

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
    maxAge: parseInt(process.env.REFRESH_TOKEN_COOKIE_EXPIRES || '7200000')
  })

  res.status(200).json({
    success: true,
    message: 'Đăng nhập thành công',
    data: {
      accessToken: response.accessToken,
      user: response.user
    }
  })
})

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id
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
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) throw new ApiError(401, 'Không có refresh token, vui lòng đăng nhập lại.')
  const newAccessToken = await authService.refreshToken(refreshToken)

  responseHandler(res, 200, 'Làm mới access token thành công', { accessToken: newAccessToken })
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

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId
  if (!userId) {
    throw new ApiError(401, 'Unauthorized')
  }
  const user = await authService.getProfile(userId)
  res.status(200).json({
    success: true,
    data: user
  })
})

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId
  if (!userId) {
    throw new ApiError(401, 'Unauthorized')
  }
  const updatedUser = await authService.updateProfile(userId, req.body, req.file)
  res.status(200).json({
    success: true,
    data: updatedUser,
    message: 'Cập nhật hồ sơ thành công'
  })
})

export default {
  registerAccount,
  loginAccount,
  logout,
  changePassword,
  refreshToken,
  getCurrentUser,
  getProfile,
  updateProfile
}
