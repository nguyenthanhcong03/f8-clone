import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import { formatTimeAgo } from '@/lib/format'
import { calculateReadingTime } from '@/lib/helper'
import type { Blog } from '@/types/blog'
import { Clock, Edit } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface IBlogItemProps {
  blog: Blog
  isMyBlog?: boolean // Nếu bài viết thuộc về người dùng hiện tại
}

const BlogItem: React.FC<IBlogItemProps> = ({ blog, isMyBlog }) => {
  const navigate = useNavigate()
  const handleNavigateToEdit = (slug: string) => {
    navigate(ROUTES.STUDENT.BLOG.EDIT(slug))
  }
  return (
    <Card key={blog.blogId} className='group overflow-hidden transition-shadow hover:shadow-lg'>
      <CardContent className='p-6'>
        <div className='flex gap-6'>
          {/* Left Content */}
          <div className='flex-1'>
            {/* Author Info */}
            <div className='mb-3 flex items-center gap-2'>
              <Avatar className='h-6 w-6'>
                <AvatarImage src={blog.author?.avatar} alt={blog.author?.fullName} />
                <AvatarFallback>{blog.author?.fullName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className='text-sm font-medium'>{blog.author?.fullName}</span>
            </div>

            {/* Title */}
            <Link to={ROUTES.PUBLIC.BLOGS.DETAIL(blog.slug)}>
              <h2 className='mb-3 text-xl font-bold transition-colors group-hover:text-primary md:text-2xl'>
                {blog.title}
              </h2>
            </Link>

            {/* Excerpt */}
            <p
              className='mb-4 line-clamp-2 text-sm text-muted-foreground'
              dangerouslySetInnerHTML={{
                __html: blog.content
              }}
            />

            {/* Meta Info */}
            <div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
              {blog.category && (
                <Badge variant='secondary' className='font-normal'>
                  {blog.category.name}
                </Badge>
              )}
              <div className='flex items-center gap-1'>
                <Clock className='h-4 w-4' />
                <span>{formatTimeAgo(blog.publishedAt || blog.createdAt)}</span>
              </div>
              <span>•</span>
              <span>{calculateReadingTime(blog.content)}</span>
            </div>
          </div>

          {/* Right Content - Thumbnail & Actions */}
          <div className='relative flex shrink-0 flex-col items-end gap-2'>
            {isMyBlog && (
              <Button variant='ghost' size='icon' className='h-8 w-8' onClick={() => handleNavigateToEdit(blog.slug)}>
                <Edit className='h-4 w-4' />
              </Button>
            )}
            <Link to={ROUTES.PUBLIC.BLOGS.DETAIL(blog.slug)} className='block'>
              <div className='relative h-32 w-48 overflow-hidden rounded-lg bg-muted'>
                {blog.thumbnail ? (
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                  />
                ) : (
                  <div className='flex h-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600'>
                    <span className='text-3xl font-bold text-white opacity-50'>{blog.title.charAt(0)}</span>
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BlogItem
