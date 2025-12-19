import { z } from 'zod'

// Schema cho việc tạo blog mới
export const createBlogSchema = z.object({
  title: z
    .string()
    .min(1, 'Tiêu đề là bắt buộc')
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),

  slug: z
    .string()
    .min(1, 'Đường dẫn không được để trống')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Đường dẫn chỉ có thể chứa chữ thường, số và dấu gạch nối'),

  content: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự'),

  categoryId: z.string().min(1, 'Thể loại là bắt buộc'),
  status: z.enum(['draft', 'published']),

  thumbnail: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Kích thước ảnh không được vượt quá 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Chỉ chấp nhận ảnh .jpg, .png, .webp'
    )
    .optional()
})

// Schema cho việc cập nhật blog
export const updateBlogSchema = z.object({
  title: z
    .string()
    .min(1, 'Tiêu đề là bắt buộc')
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),

  slug: z
    .string()
    .min(1, 'Đường dẫn không được để trống')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Đường dẫn chỉ có thể chứa chữ thường, số và dấu gạch nối'),

  content: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự'),

  categoryId: z.string().optional(),
  status: z.enum(['draft', 'published']),

  thumbnail: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Kích thước ảnh không được vượt quá 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Chỉ chấp nhận ảnh .jpg, .png, .webp'
    )
    .optional()
})

export type CreateBlogInput = z.infer<typeof createBlogSchema>
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>

// Schema cho việc tạo thể loại mới
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Tên thể loại là bắt buộc')
    .min(2, 'Tên thể loại phải có ít nhất 2 ký tự')
    .max(100, 'Tên thể loại không được vượt quá 100 ký tự'),

  slug: z
    .string()
    .min(1, 'Đường dẫn không được để trống')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Đường dẫn chỉ có thể chứa chữ thường, số và dấu gạch nối'),

  description: z.string().max(500, 'Mô tả không được vượt quá 500 ký tự').optional()
})

// Schema cho việc cập nhật thể loại
export const updateCategorySchema = createCategorySchema.partial()

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
