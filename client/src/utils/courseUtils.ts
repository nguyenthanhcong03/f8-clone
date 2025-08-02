export const translateLevel = (level?: 'beginner' | 'intermediate' | 'advanced') => {
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
