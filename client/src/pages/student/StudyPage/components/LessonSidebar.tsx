import { useAppSelector } from '@/store/hook'
import { X, ChevronDown, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface Iprops {
  params: URLSearchParams
  setParams: (params: URLSearchParams) => void
  handleDrawerToggle?: () => void
}

const SidebarLesson = ({ params, setParams, handleDrawerToggle }: Iprops) => {
  const [openSections, setOpenSections] = useState<string[]>([])
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null)
  const { currentCourse } = useAppSelector((state) => state.courses)
  const { currentLesson } = useAppSelector((state) => state.lessons)

  // Set active lesson đang được chọn từ URL
  useEffect(() => {
    const lessonId = params.get('lessonId')
    if (lessonId) {
      setActiveLessonId(Number(lessonId))
    }
  }, [params])

  // Xử lý mở accordion section khi reload
  useEffect(() => {
    if (currentLesson) {
      setOpenSections((prev) => {
        // Kiểm tra xem section của bài học hiện tại đã có trong danh sách mở chưa
        const sectionIdStr = currentLesson.section_id.toString()
        if (!prev.includes(sectionIdStr)) {
          return [...prev, sectionIdStr]
        }
        return prev
      })
    }
  }, [currentLesson])

  // Xử lý mở accordion section khi click vào section
  const handleSectionClick = (sectionId: string) => {
    if (openSections.includes(sectionId)) {
      setOpenSections(openSections.filter((id) => id !== sectionId))
    } else {
      setOpenSections([...openSections, sectionId])
    }
  }

  const handleLessonClick = (lessonId: number) => {
    setActiveLessonId(lessonId)
    setParams(new URLSearchParams({ lessonId: String(lessonId) }))
  }

  return (
    <div className='h-full border-r border-border overflow-y-auto'>
      <div className='flex justify-between items-center p-4 border-b border-border'>
        <div>
          <h2 className='text-lg font-bold'>Nội dung bài học</h2>
          <p className='text-sm text-muted-foreground'>
            {currentCourse?.sections && currentCourse?.sections.length} chương •{' '}
            {currentCourse?.sections &&
              currentCourse?.sections.reduce((sum, section) => {
                return sum + (section.lessons?.length || 0)
              }, 0)}{' '}
            bài học
          </p>
        </div>
        <div className='block lg:hidden cursor-pointer'>
          <X onClick={handleDrawerToggle} className='h-5 w-5' />
        </div>
      </div>

      <nav className='p-0'>
        {currentCourse?.sections &&
          currentCourse?.sections.map((section) => {
            const isExpanded = openSections.includes(section.id)

            return (
              <div key={section.id} className='border-b border-border'>
                {/* Section Header */}
                <button
                  onClick={() => handleSectionClick(section.id)}
                  className={cn(
                    'w-full p-3 text-left transition-colors hover:bg-accent',
                    isExpanded ? 'bg-accent' : 'bg-background'
                  )}
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-medium'>{section.title}</h3>
                      <p className='text-xs text-muted-foreground mt-1'>{section.lessons?.length} bài học</p>
                    </div>
                    <ChevronDown
                      className={cn('h-4 w-4 transition-transform', isExpanded ? 'transform rotate-180' : '')}
                    />
                  </div>
                </button>

                {/* Section Content */}
                <div
                  className={cn(
                    'transition-all duration-200 ease-in-out overflow-hidden',
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  {section?.lessons &&
                    section.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson.id)}
                        className={cn(
                          'w-full pl-8 pr-4 py-2 text-left flex items-center transition-colors hover:bg-accent',
                          activeLessonId === lesson.id ? 'bg-accent text-primary font-semibold' : 'text-foreground'
                        )}
                      >
                        <PlayCircle
                          className={cn(
                            'h-4 w-4 mr-2 flex-shrink-0',
                            activeLessonId === lesson.id ? 'text-primary' : 'text-muted-foreground'
                          )}
                        />
                        <span className='text-sm line-clamp-2'>{lesson.title}</span>
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
