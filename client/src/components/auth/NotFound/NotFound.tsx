import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

type NotFoundProps = {
  title?: string
  subTitle?: string
}

const NotFound: React.FC<NotFoundProps> = ({
  title = 'Page Not Found',
  subTitle = 'Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.'
}) => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4 text-center'>
      <h1 className='mb-4 text-6xl font-bold text-red-500'>404</h1>
      <h2 className='mb-6 text-3xl font-semibold'>{title}</h2>
      <p className='mb-8 text-lg text-gray-600'>{subTitle}</p>
      <Link to='/'>
        <Button className='w-full'>Trở về trang chủ</Button>
      </Link>
    </div>
  )
}

export default NotFound
