import { Router } from 'express'
import userController from '../controllers/user.controller'
import upload from '../middleware/upload.middleware'
import { validate } from '../middleware/validation.middleware'
import { createUserSchema, getUserSchema, updateUserSchema } from '../schemas/user.schema'

const router = Router()

router.get('/', userController.getAllUsers)

router.get('/email', userController.getUserByEmail)

router.get('/role/:role', userController.getUsersByRole)

// Route để lấy user theo username (phải đặt trước :id để tránh conflict)
router.get('/public-profile/:username', userController.getPublicProfileByUsername)

router.post('/', validate(createUserSchema), userController.createUser)

router.get('/:id', validate(getUserSchema), userController.getUserById)

router.put('/:id', validate(updateUserSchema), userController.updateUser)

router.post('/:id/avatar', validate(getUserSchema), upload.single('avatar'), userController.uploadAvatar)

router.delete('/:id/avatar', validate(getUserSchema), userController.deleteAvatar)

router.delete('/:id', validate(getUserSchema), userController.deleteUser)

export default router
