import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import type { Blog } from '@/types/blog'
import { formatTimeAgo } from '@/utils/format'
import { Clock } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

interface IBlogCardProps {
  blog: Blog
}

const BlogCard: React.FC<IBlogCardProps> = ({ blog }) => {
  return (
    <Link to={ROUTES.PUBLIC.BLOGS.DETAIL(blog.slug)}>
      <Card className='group h-full overflow-hidden transition-all hover:shadow-lg'>
        {/* Thumbnail */}
        <div className='relative aspect-video overflow-hidden bg-muted'>
          {blog.thumbnail ? (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
            />
          ) : (
            <div className='flex h-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600'>
              <span className='text-4xl font-bold text-white opacity-50'>{blog.title.charAt(0)}</span>
            </div>
          )}
          {blog.category && <Badge className='absolute left-3 top-3 bg-primary'>{blog.category.name}</Badge>}
        </div>

        <CardContent className='p-4'>
          {/* Tiêu đề */}
          <h3 className='mb-2 line-clamp-2 text-lg font-semibold transition-colors group-hover:text-primary'>
            {blog.title}
          </h3>

          {/* Nội dung */}
          <p
            className='mb-4 line-clamp-2 text-sm text-muted-foreground'
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Meta */}
          <div className='flex items-center justify-between gap-4 text-xs text-muted-foreground'>
            {blog.author && (
              <div className='flex items-center gap-1'>
                <Avatar className='h-3 w-3'>
                  <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                  <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{blog.author.name}</span>
              </div>
            )}
            <div className='flex items-center gap-1'>
              <Clock className='h-3 w-3' />
              <span>{formatTimeAgo(blog.publishedAt || blog.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default BlogCard
