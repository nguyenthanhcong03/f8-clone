import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Code, Globe, Trophy, Users, Zap } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Học từ cơ bản',
    description: 'Bắt đầu từ những kiến thức nền tảng, phù hợp cho người mới bắt đầu'
  },
  {
    icon: Code,
    title: 'Thực hành thực tế',
    description: 'Làm các dự án thực tế để áp dụng kiến thức vào công việc'
  },
  {
    icon: Users,
    title: 'Cộng đồng hỗ trợ',
    description: 'Tham gia cộng đồng học viên để trao đổi và học hỏi lẫn nhau'
  },
  {
    icon: Trophy,
    title: 'Chứng chỉ hoàn thành',
    description: 'Nhận chứng chỉ sau khi hoàn thành khóa học để nâng cao CV'
  },
  {
    icon: Zap,
    title: 'Cập nhật thường xuyên',
    description: 'Nội dung được cập nhật theo xu hướng công nghệ mới nhất'
  },
  {
    icon: Globe,
    title: 'Học mọi lúc mọi nơi',
    description: 'Truy cập khóa học 24/7 trên mọi thiết bị với kết nối internet'
  }
]

const FeaturesSection = () => {
  return (
    <section className='bg-white py-16 dark:bg-gray-900'>
      <div className='container mx-auto px-4'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl'>Tại sao chọn chúng tôi?</h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
            Chúng tôi cam kết mang đến trải nghiệm học tập tốt nhất với những tính năng vượt trội
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className='group border-0 bg-gradient-to-br from-gray-50 to-white shadow-md transition-all duration-300 hover:shadow-xl dark:from-gray-800 dark:to-gray-700'
              >
                <CardContent className='p-8'>
                  <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white transition-transform group-hover:scale-110'>
                    <Icon className='h-8 w-8' />
                  </div>

                  <h3 className='mb-4 text-xl font-bold text-gray-900 dark:text-white'>{feature.title}</h3>

                  <p className='text-gray-600 dark:text-gray-300'>{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
