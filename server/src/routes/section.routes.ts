import sectionController from '@/controllers/section.controller'
import { Router } from 'express'

const router = Router()

router.post('/', sectionController.createSection)
router.get('/:id', sectionController.getCourseSections)
router.put('/:id/reorder', sectionController.updateSectionOrder)

export default router
