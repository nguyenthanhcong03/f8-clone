import { Router } from 'express'
import userController from '../controllers/user.controller'
import { validate } from '../middleware/validation.middleware'
import { createUserSchema, getUserSchema, updateUserSchema } from '../schemas/user.schema'

const router = Router()

// GET /users - Get all users
router.get('/', userController.getAllUsers.bind(userController))

// GET /users/:id - Get user by ID
router.get('/:id', validate(getUserSchema), userController.getUserById.bind(userController))

// POST /users - Create new user
router.post('/', validate(createUserSchema), userController.createUser.bind(userController))

// PUT /users/:id - Update user
router.put('/:id', validate(updateUserSchema), userController.updateUser.bind(userController))

// DELETE /users/:id - Delete user
router.delete('/:id', validate(getUserSchema), userController.deleteUser.bind(userController))

export default router
