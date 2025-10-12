import { useState } from 'react'
import { Plus, Minus, PlayCircle } from 'lucide-react'
import { useAppSelector } from '@/store/hook'
import { cn } from '@/lib/utils'

const CourseContent = () => {
  const { currentCourse } = useAppSelector((state) => state.courses)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  return (
    <div className='space-y-2'>
      {currentCourse?.sections && currentCourse.sections.length > 0 ? (
        currentCourse.sections.map((section) => {
          const isExpanded = expandedSections[section.section_id] || false

          return (
            <div key={section.section_id} className='mb-2 overflow-hidden border border-gray-200 rounded-lg'>
              {/* Accordion Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className='w-full p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors'
              >
                <div className='flex justify-between items-center gap-4'>
                  <span className='font-medium text-left flex-1'>{section.title}</span>
                  <span className='text-sm text-muted-foreground'>
                    {section.lessons && section.lessons.length} bài học
                  </span>
                  {isExpanded ? <Minus className='h-5 w-5 text-primary' /> : <Plus className='h-5 w-5 text-primary' />}
                </div>
              </button>

              {/* Accordion Content */}
              <div
                className={cn(
                  'transition-all duration-200 ease-in-out',
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                )}
              >
                {section.lessons && section.lessons.length > 0 ? (
                  <div className='border-t border-gray-200'>
                    {section.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className='flex items-center p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors'
                      >
                        <PlayCircle className='h-4 w-4 text-primary mr-3 flex-shrink-0' />
                        <span className='text-sm flex-1'>{lesson.title}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='p-4 border-t border-gray-200'>
                    <p className='text-sm text-muted-foreground'>Không có bài học nào trong chương này.</p>
                  </div>
                )}
              </div>
            </div>
          )
        })
      ) : (
        <p className='text-sm text-muted-foreground'>Không có nội dung chương nào.</p>
      )}
    </div>
  )
}

export default CourseContent
