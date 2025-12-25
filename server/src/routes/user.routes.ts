import { Router } from 'express'
import userController from '../controllers/user.controller'
import { validate } from '../middleware/validation.middleware'
import { createUserSchema, getUserSchema, updateUserSchema } from '../schemas/user.schema'

const router = Router()

router.get('/', userController.getAllUsers)

router.get('/email', userController.getUserByEmail)

router.get('/role/:role', userController.getUsersByRole)

router.post('/', validate(createUserSchema), userController.createUser)

router.get('/:id', validate(getUserSchema), userController.getUserById)

router.put('/:id', validate(updateUserSchema), userController.updateUser)

router.delete('/:id', validate(getUserSchema), userController.deleteUser)

export default router
