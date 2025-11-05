import { z } from 'zod'

// Custom validation for file type
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ACCEPTED_VIDEO_TYPES = [
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-ms-wmv',
  'video/webm'
]

// Schema with video file validation
export const lessonSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tiêu đề bài học').max(255, 'Tiêu đề bài học không được vượt quá 255 ký tự'),
  content: z.string().optional(),
  videoUrl: z.string().url('URL video không hợp lệ').optional().or(z.literal('')),
  videoFile: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Kích thước tập tin tối đa là ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    .refine(
      (file) => ACCEPTED_VIDEO_TYPES.includes(file.type),
      'Chỉ chấp nhận các định dạng video: MP4, MPEG, MOV, AVI, WMV, WEBM'
    )
    .optional()
})

export type LessonFormValues = z.infer<typeof lessonSchema>
