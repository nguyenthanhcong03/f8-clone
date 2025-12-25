import { cn } from '@/lib/utils'
import type { Course } from '@/types/course'
import { Minus, PlayCircle, Plus } from 'lucide-react'
import { useState } from 'react'

type CourseOutlineProps = {
  courseData?: Course
  totalSections?: number
  totalLessons?: number
}

const CourseOutline = ({ courseData, totalSections, totalLessons }: CourseOutlineProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  return (
    <div className='mt-6'>
      <div className='mb-4'>
        <h2 className='text-xl font-bold'>Nội dung khóa học</h2>
        <div className='mt-2 flex gap-2 text-sm'>
          <div>
            <span className='font-medium'>{totalSections} </span>
            chương
          </div>
          •
          <div>
            <span className='font-medium'>{totalLessons || 0} </span>
            bài học
          </div>
        </div>
      </div>
      <div className='space-y-2'>
        {courseData?.sections && courseData.sections.length > 0 ? (
          courseData.sections.map((section) => {
            const isExpanded = expandedSections[section.sectionId] || false

            return (
              <div key={section.sectionId} className='mb-2 overflow-hidden rounded-lg border border-gray-200'>
                {/* Accordion Header */}
                <button
                  onClick={() => toggleSection(section.sectionId)}
                  className='w-full rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100'
                >
                  <div className='flex items-center justify-between gap-4'>
                    <span className='flex-1 text-left font-medium'>{section.title}</span>
                    <span className='text-sm text-muted-foreground'>
                      {section.lessons && section.lessons.length} bài học
                    </span>
                    {isExpanded ? (
                      <Minus className='h-5 w-5 text-primary' />
                    ) : (
                      <Plus className='h-5 w-5 text-primary' />
                    )}
                  </div>
                </button>

                {/* Accordion Content */}
                <div
                  className={cn(
                    'transition-all duration-200 ease-in-out',
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 overflow-hidden opacity-0'
                  )}
                >
                  {section.lessons && section.lessons.length > 0 ? (
                    <div className='border-t border-gray-200'>
                      {section.lessons.map((lesson) => (
                        <div
                          key={lesson.lessonId}
                          className='flex items-center border-b border-gray-200 p-4 transition-colors last:border-b-0 hover:bg-gray-50'
                        >
                          <PlayCircle className='mr-3 h-4 w-4 flex-shrink-0 text-primary' />
                          <span className='flex-1 text-sm'>{lesson.title}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='border-t border-gray-200 p-4'>
                      <p className='text-sm text-muted-foreground'>Không có bài học nào trong chương này.</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <p className='text-sm text-muted-foreground'>Không có chương học nào.</p>
        )}
      </div>
    </div>
  )
}

export default CourseOutline
