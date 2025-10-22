import { skipToken } from '@/store/hook'
import { useGetLessonByIdQuery } from '@/store/api/lessonApi'
import { Menu, ArrowLeft, ArrowRight, CheckCircle, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import ReactPlayer from 'react-player'
import { useSearchParams } from 'react-router-dom'
import { useGetCourseBySlugQuery } from '@/store/api/courseApi'
import { useParams } from 'react-router-dom'
import type { Course, Section } from '@/types/course'

interface LessonAreaProps {
  handleDrawerToggle?: () => void
}

const LessonArea = ({ handleDrawerToggle }: LessonAreaProps) => {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const lessonId = searchParams.get('lessonId')

  // Lấy dữ liệu bài học từ RTK Query
  const { data: lessonData, isLoading: lessonLoading } = useGetLessonByIdQuery(lessonId ?? skipToken)

  // Lấy thông tin khóa học từ RTK Query
  const { data: courseData } = useGetCourseBySlugQuery(slug ?? skipToken)

  const currentLesson = lessonData
  const currentCourse = courseData?.course as Course | undefined

  // TODO: Implement lesson navigation logic
  const previousLessonId = null
  const nextLessonId = null

  // Get section title
  const getSectionTitle = () => {
    if (!currentLesson) return ''
    const section = currentCourse?.sections?.find((section: Section) => section.section_id === currentLesson.section_id)
    return section?.title || ''
  }

  const navigateToLesson = (lessonId: string | null) => {
    if (lessonId) {
      setSearchParams({ lessonId: lessonId })
    }
  }

  if (!currentLesson && !lessonLoading) {
    return (
      <div className='flex h-full w-full flex-col items-center justify-center p-6'>
        <h3 className='mb-4 text-lg font-medium text-muted-foreground'>Chọn bài học từ danh sách để bắt đầu</h3>
        <p className='max-w-sm text-center text-sm text-muted-foreground'>
          Hãy chọn một bài học từ menu bên trái để xem nội dung
        </p>
      </div>
    )
  }

  return (
    <div className='flex h-full w-full flex-col overflow-hidden'>
      {/* Lesson header */}
      <div className='flex items-center justify-between border-b border-border p-4'>
        <div>
          <p className='text-sm text-muted-foreground'>{getSectionTitle()}</p>
          <h2 className='text-lg font-bold'>{currentLesson?.title}</h2>
        </div>
        <Button
          size='sm'
          // disabled={progressLoading}
          // className={cn('flex items-center gap-2', isCompleted && 'bg-green-600 hover:bg-green-700')}
        >
          <CheckCircle className='h-4 w-4' />
          Đánh dấu đã học
        </Button>
      </div>

      {/* Lesson content */}
      <div className='flex-1 overflow-auto bg-background p-6'>
        {currentLesson?.video_url ? (
          <div className='relative mb-6 w-full overflow-hidden rounded-lg pt-[56.25%]'>
            <ReactPlayer
              src={currentLesson.video_url}
              width='100%'
              height='100%'
              style={{
                position: 'absolute',
                top: 0,
                left: 0
              }}
              controls={true}
              // onEnded={() => {
              //   if (currentLesson?.id) {
              //     dispatch(saveProgress({ lessonId: currentLesson.id, isCompleted: true }))
              //   }
              // }}
            />
          </div>
        ) : (
          <div className='relative mb-6 w-full pt-[56.25%]'>
            <div className='absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-muted text-center'>
              <PlayCircle className='h-15 w-15 text-muted-foreground opacity-70' />
              <p className='mt-4 text-muted-foreground'>Video không khả dụng</p>
            </div>
          </div>
        )}

        <Card className='mb-6'>
          <CardContent className='p-6'>
            {currentLesson?.content ? (
              <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
            ) : (
              <p>Không có nội dung cho bài học này.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lesson navigation */}
      <div className='flex justify-between border-t border-border p-4'>
        {/* Mobile Drawer Toggle Button */}
        <div className='flex items-center justify-center gap-2 lg:hidden'>
          <Button onClick={handleDrawerToggle} variant='outline' size='sm' className='border border-border'>
            <Menu className='h-4 w-4' />
          </Button>
          <span className='whitespace-nowrap text-sm font-bold'>{currentLesson?.title}</span>
        </div>

        <div className='flex w-full justify-end gap-4 lg:justify-between'>
          <Button
            disabled={!previousLessonId}
            onClick={() => navigateToLesson(previousLessonId)}
            variant='outline'
            className='flex items-center gap-2'
          >
            <ArrowLeft className='h-4 w-4' />
            Bài trước
          </Button>

          <Button
            disabled={!nextLessonId}
            onClick={() => navigateToLesson(nextLessonId)}
            className='flex items-center gap-2'
          >
            Bài tiếp theo
            <ArrowRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LessonArea
