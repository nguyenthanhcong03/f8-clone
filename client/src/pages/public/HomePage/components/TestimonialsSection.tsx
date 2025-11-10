import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Quote, Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Nguyễn Văn An',
    role: 'Frontend Developer tại VNG',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    content:
      'Khóa học React.js ở đây thực sự chất lượng. Tôi đã học được rất nhiều kỹ năng thực tế và hiện tại đang làm việc tại một công ty công nghệ hàng đầu.',
    rating: 5
  },
  {
    name: 'Trần Thị Bình',
    role: 'Fullstack Developer tại FPT',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    content:
      'Giảng viên nhiệt tình, nội dung được cập nhật thường xuyên. Đặc biệt là có rất nhiều bài tập thực hành giúp tôi tự tin hơn khi đi phỏng vấn.',
    rating: 5
  },
  {
    name: 'Lê Minh Cường',
    role: 'Backend Developer tại Tiki',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    content:
      'Từ một người không biết gì về lập trình, giờ tôi đã có thể tự tin làm việc với Node.js và MongoDB. Cảm ơn platform này rất nhiều!',
    rating: 5
  }
]

const TestimonialsSection = () => {
  return (
    <section className='bg-gray-50 py-16 dark:bg-gray-800'>
      <div className='container mx-auto px-4'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl'>
            Học viên nói gì về chúng tôi
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
            Những phản hồi chân thực từ học viên đã thành công trong sự nghiệp
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className='border-0 bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-700'
            >
              <CardContent className='p-8'>
                {/* Quote icon */}
                <div className='mb-6 flex justify-center'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800'>
                    <Quote className='h-6 w-6 text-blue-600 dark:text-blue-300' />
                  </div>
                </div>

                {/* Rating */}
                <div className='mb-4 flex justify-center gap-1'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                  ))}
                </div>

                {/* Content */}
                <p className='mb-6 text-center text-gray-600 dark:text-gray-300'>"{testimonial.content}"</p>

                {/* Author */}
                <div className='flex flex-col items-center'>
                  <Avatar className='mb-4 h-16 w-16'>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <h4 className='font-semibold text-gray-900 dark:text-white'>{testimonial.name}</h4>

                  <p className='text-sm text-gray-600 dark:text-gray-400'>{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
