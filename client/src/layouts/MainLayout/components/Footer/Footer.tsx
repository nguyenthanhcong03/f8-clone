import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white'>
      <div className='container mx-auto px-4 py-16'>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {/* Company Info */}
          <div>
            <h3 className='mb-6 text-xl font-bold'>F8 - Học lập trình để đi làm</h3>
            <p className='mb-4 text-gray-400'>
              Nền tảng học lập trình trực tuyến hàng đầu Việt Nam, cung cấp các khóa học chất lượng cao từ cơ bản đến
              nâng cao.
            </p>

            <div className='space-y-2 text-sm text-gray-400'>
              <div className='flex items-center gap-2'>
                <MapPin className='h-4 w-4' />
                <span>123 Nguyễn Văn Linh, Q.7, TP.HCM</span>
              </div>
              <div className='flex items-center gap-2'>
                <Phone className='h-4 w-4' />
                <span>0123 456 789</span>
              </div>
              <div className='flex items-center gap-2'>
                <Mail className='h-4 w-4' />
                <span>contact@f8.edu.vn</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='mb-6 text-lg font-semibold'>Liên kết nhanh</h4>
            <ul className='space-y-3 text-gray-400'>
              <li>
                <Link to='/courses' className='transition-colors hover:text-white'>
                  Khóa học
                </Link>
              </li>
              <li>
                <Link to='/blog' className='transition-colors hover:text-white'>
                  Blog
                </Link>
              </li>
              <li>
                <Link to='/about' className='transition-colors hover:text-white'>
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to='/contact' className='transition-colors hover:text-white'>
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to='/careers' className='transition-colors hover:text-white'>
                  Tuyển dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className='mb-6 text-lg font-semibold'>Danh mục khóa học</h4>
            <ul className='space-y-3 text-gray-400'>
              <li>
                <Link to='/courses/frontend' className='transition-colors hover:text-white'>
                  Frontend Development
                </Link>
              </li>
              <li>
                <Link to='/courses/backend' className='transition-colors hover:text-white'>
                  Backend Development
                </Link>
              </li>
              <li>
                <Link to='/courses/mobile' className='transition-colors hover:text-white'>
                  Mobile Development
                </Link>
              </li>
              <li>
                <Link to='/courses/devops' className='transition-colors hover:text-white'>
                  DevOps
                </Link>
              </li>
              <li>
                <Link to='/courses/data-science' className='transition-colors hover:text-white'>
                  Data Science
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className='mb-6 text-lg font-semibold'>Theo dõi chúng tôi</h4>
            <p className='mb-4 text-gray-400'>
              Kết nối với chúng tôi trên các mạng xã hội để cập nhật thông tin mới nhất
            </p>

            <div className='flex gap-4'>
              <a
                href='#'
                className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:scale-110 hover:bg-blue-700'
              >
                <Facebook className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white transition-all hover:scale-110 hover:bg-sky-600'
              >
                <Twitter className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition-all hover:scale-110 hover:bg-red-700'
              >
                <Youtube className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='flex h-10 w-10 items-center justify-center rounded-full bg-pink-600 text-white transition-all hover:scale-110 hover:bg-pink-700'
              >
                <Instagram className='h-5 w-5' />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className='mt-12 border-t border-gray-800 pt-8'>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            <p className='text-gray-400'>© 2024 F8 Education. All rights reserved.</p>

            <div className='flex gap-6 text-sm text-gray-400'>
              <Link to='/privacy' className='transition-colors hover:text-white'>
                Chính sách bảo mật
              </Link>
              <Link to='/terms' className='transition-colors hover:text-white'>
                Điều khoản sử dụng
              </Link>
              <Link to='/support' className='transition-colors hover:text-white'>
                Hỗ trợ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
