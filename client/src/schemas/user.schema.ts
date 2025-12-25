import { z } from 'zod'

// Schema cho việc cập nhật profile
export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Họ và tên là bắt buộc')
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên không được vượt quá 100 ký tự'),

  username: z
    .string()
    .min(1, 'Tên người dùng là bắt buộc')
    .min(3, 'Tên người dùng phải có ít nhất 3 ký tự')
    .max(50, 'Tên người dùng không được vượt quá 50 ký tự')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Tên người dùng chỉ có thể chứa chữ cái, số, gạch dưới và gạch ngang'),

  phone: z
    .string()
    .regex(/^(\+84|0)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ')
    .optional()
    .or(z.literal(''))
})

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
