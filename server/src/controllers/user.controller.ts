import { Request, Response } from 'express'
import userService from '../services/user.service'
import { CreateUserInput, GetUserInput, UpdateUserInput } from '../schemas/user.schema'

export class UserController {
  async createUser(req: Request<{}, {}, CreateUserInput['body']>, res: Response) {
    try {
      const user = await userService.createUser(req.body)
      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully'
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      })
    }
  }

  async getAllUsers(req: Request, res: Response) {
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

  async getUserById(req: Request<GetUserInput['params']>, res: Response) {
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

  async updateUser(req: Request<UpdateUserInput['params'], {}, UpdateUserInput['body']>, res: Response) {
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

  async deleteUser(req: Request<GetUserInput['params']>, res: Response) {
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
}

export default new UserController()
