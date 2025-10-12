import { Router } from 'express'
import userController from '../controllers/user.controller'
import { validate } from '../middleware/validation.middleware'
import { createUserSchema, getUserSchema, updateUserSchema, changePasswordSchema } from '../schemas/user.schema'
import upload from '../middleware/upload.middleware'

const router = Router()

router.get('/', userController.getAllUsers.bind(userController))

router.get('/email', userController.getUserByEmail.bind(userController))

router.get('/role/:role', userController.getUsersByRole.bind(userController))

router.get('/:id', validate(getUserSchema), userController.getUserById.bind(userController))

router.post('/', validate(createUserSchema), userController.createUser.bind(userController))

router.put('/:id', validate(updateUserSchema), userController.updateUser.bind(userController))

router.post(
  '/:id/avatar',
  validate(getUserSchema),
  upload.single('avatar'),
  userController.uploadAvatar.bind(userController)
)

router.delete('/:id/avatar', validate(getUserSchema), userController.deleteAvatar.bind(userController))

router.delete('/:id', validate(getUserSchema), userController.deleteUser.bind(userController))

export default router
