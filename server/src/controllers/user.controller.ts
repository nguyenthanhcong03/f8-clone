import { Request, Response } from 'express'
import userService from '../services/user.service'
import { CreateUserInput, GetUserInput, UpdateUserInput } from '../schemas/user.schema'
import asyncHandler from '@/utils/asyncHandler'
import { responseHandler } from '@/utils/responseHandler'

const createUser = async (req: Request<object, object, CreateUserInput['body']>, res: Response) => {
  try {
    const user = await userService.createUser(req.body)
    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    })
  } catch (error) {
    const statusCode = error instanceof Error && error.message === 'User with this email already exists' ? 409 : 400
    res.status(statusCode).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    })
  }
}

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers()
    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    })
  }
}

const getUserById = async (req: Request<GetUserInput['params']>, res: Response) => {
  try {
    const userId = parseInt(req.params.id)
    const user = await userService.getUserById(userId)
    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    const statusCode = error instanceof Error && error.message === 'User not found' ? 404 : 500
    res.status(statusCode).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    })
  }
}

const updateUser = async (req: Request<UpdateUserInput['params'], object, UpdateUserInput['body']>, res: Response) => {
  try {
    const userId = parseInt(req.params.id)
    const user = await userService.updateUser(userId, req.body)
    res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully'
    })
  } catch (error) {
    const statusCode = error instanceof Error && error.message === 'User not found' ? 404 : 500
    res.status(statusCode).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    })
  }
}

const deleteUser = async (req: Request<GetUserInput['params']>, res: Response) => {
  try {
    const userId = parseInt(req.params.id)
    const result = await userService.deleteUser(userId)
    res.status(200).json({
      success: true,
      message: result.message
    })
  } catch (error) {
    const statusCode = error instanceof Error && error.message === 'User not found' ? 404 : 500
    res.status(statusCode).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    })
  }
}

const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.query
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Email parameter is required'
      })
    }
    const user = await userService.getUserByEmail(email)
    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    const statusCode = error instanceof Error && error.message === 'User not found' ? 404 : 500
    res.status(statusCode).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    })
  }
}

const getUsersByRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.params
    if (role !== 'admin' && role !== 'student') {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be "admin" or "student"'
      })
    }
    const users = await userService.getUsersByRole(role)
    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    })
  }
}

const uploadAvatar = async (req: Request<GetUserInput['params']>, res: Response) => {
  try {
    const userId = parseInt(req.params.id)

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      })
    }

    const user = await userService.uploadAvatar(userId, req.file.buffer)
    res.status(200).json({
      success: true,
      data: user,
      message: 'Avatar uploaded successfully'
    })
  } catch (error) {
    const statusCode = error instanceof Error && error.message === 'User not found' ? 404 : 500
    res.status(statusCode).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    })
  }
}

const deleteAvatar = async (req: Request<GetUserInput['params']>, res: Response) => {
  try {
    const userId = parseInt(req.params.id)
    const user = await userService.deleteAvatar(userId)
    res.status(200).json({
      success: true,
      data: user,
      message: 'Avatar deleted successfully'
    })
  } catch (error) {
    const statusCode = error instanceof Error && error.message === 'User not found' ? 404 : 500
    res.status(statusCode).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    })
  }
}

const getPublicProfileByUsername = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params
  const user = await userService.getPublicProfileByUsername(username)
  responseHandler(res, 200, 'Lấy thông tin người dùng thành công', user)
})

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
  getUsersByRole,
  uploadAvatar,
  deleteAvatar,
  getPublicProfileByUsername
}
