import sectionController from '@/controllers/section.controller'
import { Router } from 'express'

const router = Router()

router.post('/', sectionController.createSection)
router.put('/:id', sectionController.updateSection)
router.get('/:id', sectionController.getCourseSections)
router.delete('/:id', sectionController.deleteSection)
router.put('/:id/reorder', sectionController.updateSectionOrder)

export default router
