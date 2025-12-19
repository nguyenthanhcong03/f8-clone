// Hàm format giá tiền
export const formatPrice = (price: number | null | undefined, isPaid: boolean | undefined) => {
  if (!isPaid) return 'Miễn phí'
  if (!price || price === 0) return 'Miễn phí'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

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

export const formatDate = (date?: Date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
