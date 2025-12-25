import uploadController from '@/controllers/upload.controller'
import { Router } from 'express'
import upload from '../middleware/upload.middleware'

const router = Router()

router.post('/', upload.single('file'), uploadController.uploadImageController)

export default router
