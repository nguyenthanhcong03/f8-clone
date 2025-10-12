import { useAppDispatch, useAppSelector } from '@/store/hook'
import { fetchLessonById } from '@/store/features/courses/lessonSlice'
import { saveProgress } from '@/store/features/courses/progressSlice'
import { Menu, ArrowLeft, ArrowRight, CheckCircle, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import ReactPlayer from 'react-player'
import { useSearchParams } from 'react-router-dom'

const LessonArea = ({ handleDrawerToggle }: { handleDrawerToggle?: () => void }) => {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const lessonId = searchParams.get('lessonId')
  const { currentLesson, lessonLoading } = useAppSelector((state) => state.lessons)
  const { loading: progressLoading, isCompleted } = useAppSelector((state) => state.progress)
  const { currentCourse } = useAppSelector((state) => state.courses)

  // TODO: Implement lesson navigation logic
  const previousLessonId = null
  const nextLessonId = null

  useEffect(() => {
    if (lessonId) {
      dispatch(fetchLessonById(parseInt(lessonId)))
    }
  }, [dispatch, lessonId])

  // Get section title
  const getSectionTitle = () => {
    if (!currentLesson) return ''
    const section =
      currentCourse?.sections &&
      currentCourse.sections.find((section) => section.id === currentLesson.section_id.toString())
    return section?.title || ''
  }

  const navigateToLesson = (lessonId: number | null) => {
    if (lessonId) {
      setSearchParams({ lessonId: String(lessonId) })
    }
  }

  if (!currentLesson && !lessonLoading) {
    return (
      <div className='flex flex-col justify-center items-center h-full w-full p-6'>
        <h3 className='text-lg font-medium text-muted-foreground mb-4'>Chọn bài học từ danh sách để bắt đầu</h3>
        <p className='text-sm text-muted-foreground max-w-sm text-center'>
          Hãy chọn một bài học từ menu bên trái để xem nội dung
        </p>
      </div>
    )
  }

  return (
    <div className='w-full h-full flex flex-col overflow-hidden'>
      {/* Lesson header */}
      <div className='flex justify-between items-center p-4 border-b border-border'>
        <div>
          <p className='text-sm text-muted-foreground'>{getSectionTitle()}</p>
          <h2 className='text-lg font-bold'>{currentLesson?.title}</h2>
        </div>
        <Button
          size='sm'
          disabled={progressLoading}
          className={cn('flex items-center gap-2', isCompleted && 'bg-green-600 hover:bg-green-700')}
        >
          <CheckCircle className='h-4 w-4' />
          Đánh dấu đã học
        </Button>
      </div>

      {/* Lesson content */}
      <div className='p-6 overflow-auto flex-1 bg-background'>
        {currentLesson?.video_url ? (
          <div className='relative pt-[56.25%] w-full mb-6 overflow-hidden rounded-lg'>
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
              onEnded={() => {
                if (currentLesson?.id) {
                  dispatch(saveProgress({ lessonId: currentLesson.id, isCompleted: true }))
                }
              }}
            />
          </div>
        ) : (
          <div className='relative pt-[56.25%] w-full mb-6'>
            <div className='absolute inset-0 flex flex-col justify-center items-center bg-muted rounded-lg text-center'>
              <PlayCircle className='h-15 w-15 opacity-70 text-muted-foreground' />
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
      <div className='p-4 flex justify-between border-t border-border'>
        {/* Mobile Drawer Toggle Button */}
        <div className='flex lg:hidden justify-center items-center gap-2'>
          <Button onClick={handleDrawerToggle} variant='outline' size='sm' className='border border-border'>
            <Menu className='h-4 w-4' />
          </Button>
          <span className='font-bold text-sm whitespace-nowrap'>{currentLesson?.title}</span>
        </div>

        <div className='flex gap-4 w-full justify-end lg:justify-between'>
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
