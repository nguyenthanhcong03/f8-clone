import { type ClassValue, clsx } from 'clsx'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Hàm format thời gian đã qua (VD: 3 ngày trước)
export const formatTimeAgo = (date?: Date | string) => {
  if (!date) return ''
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: vi
  })
}

// Hàm format giá tiền
export const formatPrice = (price: number | null | undefined, isPaid: boolean | undefined) => {
  if (!isPaid) return 'Miễn phí'
  if (!price || price === 0) return 'Miễn phí'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

// Hàm format tiền tệ (VD: 1.000.000 ₫)
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Hàm format level
export const formatLevel = (level?: 'beginner' | 'intermediate' | 'advanced') => {
  switch (level) {
    case 'beginner':
      return 'Cơ bản'
    case 'intermediate':
      return 'Trung cấp'
    case 'advanced':
      return 'Nâng cao'
    default:
      return 'Không xác định'
  }
}

// Hàm format ngày tháng VD: 20 tháng 10, 2023
export const formatDate = (date?: Date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Tính toán thời gian đọc bài viết
export const calculateReadingTime = (content: string) => {
  const text = content.replace(/<[^>]*>/g, '')
  const words = text.split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} phút đọc`
}
