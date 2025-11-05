import { z } from 'zod'

// Schema cho việc tạo course mới
export const createCourseSchema = z.object({
  title: z
    .string()
    .min(1, 'Tên khóa học là bắt buộc')
    .min(3, 'Tên khóa học phải có ít nhất 3 ký tự')
    .max(255, 'Tên khóa học không được vượt quá 255 ký tự'),

  slug: z
    .string()
    .min(1, 'Đường dẫn khóa học không được để trống')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Đường dẫn khóa học chỉ có thể chứa chữ thường, số và dấu gạch nối'),

  description: z
    .string()
    .min(20, 'Mô tả phải có ít nhất 20 ký tự')
    .max(2000, 'Mô tả không được vượt quá 2000 ký tự')
    .optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),

  isPaid: z.boolean(),

  price: z.number().nonnegative('Giá tiền không được âm').optional(),
  isPublished: z.boolean(),
  thumbnail: z
    .file()
    .max(5 * 1024 * 1024, 'Kích thước ảnh không được vượt quá 5MB')
    .mime(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'], 'Chỉ chấp nhận ảnh .jpg, .png, .webp')
    .optional()
})
// .refine(
//   (data) => {
//     // Nếu isPaid = true thì price phải có giá trị và > 0
//     if (data.isPaid) {
//       return data.price !== undefined && data.price !== null && data.price > 0
//     }
//     return true
//   },
//   {
//     message: 'Giá tiền là bắt buộc khi khóa học trả phí',
//     path: ['price']
//   }
// )

// Schema cho việc cập nhật course
export const updateCourseSchema = createCourseSchema.partial()

export type CreateCourseInput = z.infer<typeof createCourseSchema>
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>
