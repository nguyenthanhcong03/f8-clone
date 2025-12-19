export interface ApiResponse<T> {
  success: boolean // Trạng thái thành công hay thất bại
  message?: string // Thông điệp mô tả kết quả
  data?: T // Dữ liệu trả về (nếu có)
  errors?: any // Chi tiết lỗi (nếu có)
  statusCode?: number // Mã HTTP status
}

export interface PaginationResponse<T> {
  total: number // Tổng số mục
  page: number // Trang hiện tại
  limit: number // Số mục trên mỗi trang
  totalPages: number // Tổng số trang
  data: T[] // Mảng dữ liệu của trang hiện tại
}
