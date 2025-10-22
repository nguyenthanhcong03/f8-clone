export interface ApiResponse<T> {
  success: boolean // Trạng thái thành công hay thất bại
  message?: string // Thông điệp mô tả kết quả
  data?: T // Dữ liệu trả về (nếu có)
  // error?: any // Thông tin lỗi (nếu có)
  // statusCode: number // Mã HTTP status
}
