import { Router } from 'express'
import userController from '../controllers/user.controller'
import { validate } from '../middleware/validation.middleware'
import { createUserSchema, getUserSchema, updateUserSchema, changePasswordSchema } from '../schemas/user.schema'
import upload from '../middleware/upload.middleware'

const router = Router()

// GET /users - Get all users
router.get('/', userController.getAllUsers.bind(userController))

// GET /users/email - Get user by email (query parameter)
router.get('/email', userController.getUserByEmail.bind(userController))

// GET /users/role/:role - Get users by role
router.get('/role/:role', userController.getUsersByRole.bind(userController))

// GET /users/:id - Get user by ID
router.get('/:id', validate(getUserSchema), userController.getUserById.bind(userController))

// POST /users - Create new user
router.post('/', validate(createUserSchema), userController.createUser.bind(userController))

// PUT /users/:id - Update user
router.put('/:id', validate(updateUserSchema), userController.updateUser.bind(userController))

// POST /users/:id/avatar - Upload avatar
router.post(
  '/:id/avatar',
  validate(getUserSchema),
  upload.single('avatar'),
  userController.uploadAvatar.bind(userController)
)

// DELETE /users/:id/avatar - Delete avatar
router.delete('/:id/avatar', validate(getUserSchema), userController.deleteAvatar.bind(userController))

// DELETE /users/:id - Delete user
router.delete('/:id', validate(getUserSchema), userController.deleteUser.bind(userController))

export default router
