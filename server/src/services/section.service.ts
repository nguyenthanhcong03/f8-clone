import ApiError from '@/utils/ApiError'
import Section from '../models/section.model'
import Lesson from '../models/lesson.model'

interface CreateSectionData {
  title: string
  course_id: number
  order?: number
}

const createSection = async (sectionData: CreateSectionData) => {
  const section = await Section.create(sectionData)
  return section
}

const getCourseSectionsById = async (id: number) => {
  const sections = await Section.findAll({
    where: { course_id: id },
    order: [['order', 'ASC']], // nếu có field order
    include: [
      {
        model: Lesson,
        as: 'lessons',
        order: [['order', 'ASC']]
      }
    ]
  })
  return sections
}

const updateSectionOrder = async (courseId: number, sectionIds: number[]) => {
  const sections = await Section.findAll({
    where: { course_id: courseId }
  })

  if (sections.length !== sectionIds.length) {
    throw new ApiError(400, 'Invalid section IDs provided')
  }

  const updatedSections = await Promise.all(
    sectionIds.map((id, index) => {
      const section = sections.find((s) => s.id === id)
      if (!section) {
        throw new ApiError(404, `Section with ID ${id} not found`)
      }
      return section.update({ order: index + 1 })
    })
  )

  return updatedSections
}

export default {
  createSection,
  getCourseSectionsById,
  updateSectionOrder
}
