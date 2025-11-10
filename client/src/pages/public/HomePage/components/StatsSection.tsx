import { BookOpen, GraduationCap, Star, Users } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '100,000+',
    label: 'Học viên đã tham gia',
    description: 'Cộng đồng học viên đông đảo và năng động'
  },
  {
    icon: BookOpen,
    value: '500+',
    label: 'Khóa học chất lượng',
    description: 'Đa dạng từ cơ bản đến nâng cao'
  },
  {
    icon: GraduationCap,
    value: '50,000+',
    label: 'Chứng chỉ đã cấp',
    description: 'Được công nhận bởi các doanh nghiệp'
  },
  {
    icon: Star,
    value: '4.9/5',
    label: 'Đánh giá trung bình',
    description: 'Từ phản hồi của học viên'
  }
]

const StatsSection = () => {
  return (
    <section className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-16'>
      <div className='container mx-auto px-4'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-white lg:text-4xl'>Thành tích đáng tự hào</h2>
          <p className='mx-auto max-w-2xl text-lg text-blue-100'>
            Những con số ấn tượng thể hiện sự tin tưởng của cộng đồng học viên
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className='group text-center'>
                <div className='mb-6 flex justify-center'>
                  <div className='flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20'>
                    <Icon className='h-10 w-10 text-white' />
                  </div>
                </div>

                <div className='mb-2 text-4xl font-bold text-white lg:text-5xl'>{stat.value}</div>

                <h3 className='mb-2 text-xl font-semibold text-blue-100'>{stat.label}</h3>

                <p className='text-blue-200'>{stat.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
