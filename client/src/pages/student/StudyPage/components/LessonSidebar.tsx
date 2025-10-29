import { X, ChevronDown, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import type { Course, Lesson } from '@/types/course'

interface Iprops {
  params: URLSearchParams
  setParams: (params: URLSearchParams) => void
  handleDrawerToggle?: () => void
  courseData?: Course
  lessonData?: Lesson
}

const SidebarLesson = ({ params, setParams, handleDrawerToggle, courseData, lessonData }: Iprops) => {
  const [openSections, setOpenSections] = useState<string[]>([])
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)

  // Set active lesson đang được chọn từ URL
  useEffect(() => {
    const lessonId = params.get('lessonId')
    if (lessonId) {
      setActiveLessonId(lessonId)
    }
  }, [params])

  // Xử lý mở accordion section khi reload
  useEffect(() => {
    if (lessonData) {
      setOpenSections((prev) => {
        // Kiểm tra xem section của bài học hiện tại đã có trong danh sách mở chưa
        const sectionIdStr = lessonData.sectionId
        if (!prev.includes(sectionIdStr)) {
          return [...prev, sectionIdStr]
        }
        return prev
      })
    }
  }, [lessonData])

  // Xử lý mở accordion section khi click vào section
  const handleSectionClick = (sectionId: string) => {
    if (openSections.includes(sectionId)) {
      setOpenSections(openSections.filter((id) => id !== sectionId))
    } else {
      setOpenSections([...openSections, sectionId])
    }
  }

  const handleLessonClick = (lessonId: string) => {
    setActiveLessonId(lessonId)
    setParams(new URLSearchParams({ lessonId: lessonId }))
  }

  return (
    <div className='h-full overflow-y-auto border-r border-border'>
      <div className='flex items-center justify-between border-b border-border p-4'>
        <div>
          <h2 className='text-lg font-bold'>Nội dung bài học</h2>
          <p className='text-sm text-muted-foreground'>
            {courseData?.sections && courseData?.sections.length} chương •{' '}
            {courseData?.sections &&
              courseData?.sections.reduce((sum, section) => {
                return sum + (section.lessons?.length || 0)
              }, 0)}{' '}
            bài học
          </p>
        </div>
        <div className='block cursor-pointer lg:hidden'>
          <X onClick={handleDrawerToggle} className='h-5 w-5' />
        </div>
      </div>

      <nav className='p-0'>
        {courseData?.sections &&
          courseData?.sections.map((section) => {
            const isExpanded = openSections.includes(section.sectionId)

            return (
              <div key={section.sectionId} className='border-b border-border'>
                {/* Section Header */}
                <button
                  onClick={() => handleSectionClick(section.sectionId)}
                  className={cn(
                    'w-full p-3 text-left transition-colors hover:bg-accent',
                    isExpanded ? 'bg-accent' : 'bg-background'
                  )}
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-medium'>{section.title}</h3>
                      <p className='mt-1 text-xs text-muted-foreground'>{section.lessons?.length} bài học</p>
                    </div>
                    <ChevronDown
                      className={cn('h-4 w-4 transition-transform', isExpanded ? 'rotate-180 transform' : '')}
                    />
                  </div>
                </button>

                {/* Section Content */}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-200 ease-in-out',
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  {section?.lessons &&
                    section.lessons.map((lesson) => (
                      <button
                        key={lesson.lessonId}
                        onClick={() => handleLessonClick(lesson.lessonId)}
                        className={cn(
                          'flex w-full items-center py-2 pl-8 pr-4 text-left transition-colors hover:bg-accent',
                          activeLessonId === lesson.lessonId
                            ? 'bg-accent font-semibold text-primary'
                            : 'text-foreground'
                        )}
                      >
                        <PlayCircle
                          className={cn(
                            'mr-2 h-4 w-4 flex-shrink-0',
                            activeLessonId === lesson.lessonId ? 'text-primary' : 'text-muted-foreground'
                          )}
                        />
                        <span className='line-clamp-2 text-sm'>{lesson.title}</span>
                      </button>
                    ))}
                </div>
              </div>
            )
          })}
      </nav>
    </div>
  )
}

export default SidebarLesson
