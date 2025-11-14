import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import type { Course } from '@/types/course'
import { formatCurrency } from '@/utils/format'
import { XIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type CourseCheckoutModalProps = {
  course: Course
  open: boolean
  onClose: () => void
}

const CourseCheckoutModal: React.FC<CourseCheckoutModalProps> = ({ open, onClose, course }) => {
  const navigate = useNavigate()
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='mx-auto rounded-2xl p-0 md:max-w-3xl lg:max-w-4xl'>
        <DialogClose
          aria-label='Đóng'
          className='absolute right-4 top-4 rounded-full bg-[#E9F1F8] p-2 transition hover:bg-[#d0e4f0]'
        >
          <XIcon className='h-5 w-5 text-gray-600' />
        </DialogClose>

        <div className='grid grid-cols-1 gap-8 p-6 px-4 py-6 md:grid-cols-2 md:px-8 md:py-8'>
          {/* Left Section */}
          <section className='space-y-6'>
            <h1 className='text-3xl font-bold text-blue-600'>{course.title}</h1>
            <p
              className='prose max-w-none text-gray-700' // dùng tailwind-typography để format đẹp
              dangerouslySetInnerHTML={{ __html: course.description! }}
            />
            <ul className='list-inside list-disc space-y-2 text-gray-800'>
              <li>Hiểu kỹ thuật xây dựng giao diện web</li>
              <li>Phân tích và xây dựng giao diện responsive</li>
              <li>Kiến thức UI/UX trong thiết kế web</li>
              <li>Phát triển tư duy thiết kế giao diện</li>
              <li>Nền tảng vững chắc để học JavaScript</li>
              <li>Học trên nền tảng F8 Pro</li>
            </ul>
          </section>

          {/* Right Section */}
          <section className='space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-md'>
            <h2 className='text-xl font-semibold text-gray-800'>Thông tin thanh toán</h2>
            <div className='space-y-1 text-gray-700'>
              <p>
                Khóa học: <strong>{course.title}</strong>
              </p>
              <p>
                Giá gốc: <span className='text-red-500 line-through'>{formatCurrency(course.price!)}</span>
              </p>
              <p>
                Giá hôm nay: <span className='text-lg font-bold text-green-600'>{formatCurrency(course.price!)}</span>
              </p>
            </div>

            <div className='space-y-2'>
              <label htmlFor='discount' className='block text-sm font-medium text-gray-700'>
                Nhập mã giảm giá
              </label>
              <div className='flex'>
                <input
                  id='discount'
                  type='text'
                  className='flex-1 rounded-l border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Nhập mã giảm giá'
                />
                <button className='rounded-r bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700'>
                  Áp dụng
                </button>
              </div>
              <a href='#' className='text-sm text-blue-500 hover:underline'>
                👉 Xem danh sách mã giảm giá
              </a>
            </div>

            <div className='text-right font-semibold text-gray-800'>
              Tổng cộng: <span className='text-xl text-green-600'>{formatCurrency(course.price!)}</span>
            </div>

            <button
              onClick={() => navigate('')}
              className='w-full rounded-lg bg-green-600 py-3 text-white transition hover:bg-green-700'
            >
              Tiếp tục thanh toán
            </button>
            <p className='text-center text-xs text-gray-500'>Thanh toán an toàn với SePay</p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CourseCheckoutModal
