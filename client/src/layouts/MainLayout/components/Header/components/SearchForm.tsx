import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'
import { ROUTES } from '@/lib/constants'
import { useSearchCourseAndBlogQuery } from '@/services/api/courseApi'
import { BookOpen, FileText, Loader2, Search, X } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const SearchForm: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showResults, setShowResults] = useState(false)
  const debouncedSearch = useDebounce(searchTerm, 500)
  const searchRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, isFetching } = useSearchCourseAndBlogQuery(
    { search: debouncedSearch, type: 'all', limit: 8 },
    { skip: !debouncedSearch || debouncedSearch.length < 2 }
  )

  const results = data?.data?.data || []
  const totalResults = data?.data?.total || 0

  // Phân loại kết quả
  const { courses, blogs } = useMemo(() => {
    return {
      courses: results.filter((item) => item.type === 'course'),
      blogs: results.filter((item) => item.type === 'blog')
    }
  }, [results])

  // Đóng kết quả khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Hiển thị kết quả khi có search term
  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }, [debouncedSearch])

  const handleClear = () => {
    setSearchTerm('')
    setShowResults(false)
  }

  const handleResultClick = () => {
    setShowResults(false)
    setSearchTerm('')
  }

  return (
    <div className='relative min-w-60 max-w-md flex-1' ref={searchRef}>
      <div className='hidden h-10 items-center overflow-hidden rounded-full border bg-muted/50 px-4 lg:flex'>
        <Search className='h-4 w-4 flex-shrink-0 text-muted-foreground' />
        <Input
          className='border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
          placeholder='Tìm kiếm khóa học, bài viết...'
          aria-label='search'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
        />
        {searchTerm && (
          <button onClick={handleClear} className='ml-2 flex-shrink-0 text-muted-foreground hover:text-foreground'>
            <X className='h-4 w-4' />
          </button>
        )}
        {(isLoading || isFetching) && (
          <Loader2 className='ml-2 h-4 w-4 flex-shrink-0 animate-spin text-muted-foreground' />
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className='absolute left-0 right-0 top-12 z-50 max-h-[500px] overflow-y-auto rounded-xl border bg-background shadow-lg'>
          {isLoading || isFetching ? (
            <div className='flex items-center justify-center p-8'>
              <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
            </div>
          ) : results.length > 0 ? (
            <>
              <div className='border-b p-2 text-sm text-muted-foreground'>Tìm thấy {totalResults} kết quả</div>
              <div className='flex flex-col gap-4 px-4 py-2'>
                {/* Render khóa học */}
                {courses.length > 0 && (
                  <div>
                    <div className='mb-2 flex items-center justify-between text-sm'>
                      <h3 className='flex items-center gap-2 font-semibold uppercase'>Khóa học ({blogs.length})</h3>
                      <Link to={''} className='text-gray-500 hover:underline'>
                        Xem thêm
                      </Link>
                    </div>
                    <hr />
                    <div className='space-y-1'>
                      {courses.map((course) => (
                        <Link
                          key={course.courseId}
                          to={ROUTES.PUBLIC.BLOG_DETAIL(course.slug)}
                          onClick={handleResultClick}
                          className='flex items-center gap-3 rounded-lg py-2 transition-colors hover:bg-muted/50'
                        >
                          {/* Thumbnail */}
                          <div className='h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-muted'>
                            <img src={course.thumbnail} alt={course.title} className='h-full w-full object-cover' />
                          </div>

                          {/* Title */}
                          <h4 className='line-clamp-2 min-w-0 flex-1 text-sm'>{course.title}</h4>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Render bài viết */}
                {blogs.length > 0 && (
                  <div>
                    <div className='mb-2 flex items-center justify-between text-sm'>
                      <h3 className='flex items-center gap-2 font-semibold uppercase'>Bài viết ({blogs.length})</h3>
                      <Link to={''} className='text-gray-500 hover:underline'>
                        Xem thêm
                      </Link>
                    </div>
                    <hr />
                    <div className='space-y-1'>
                      {blogs.map((blog) => (
                        <Link
                          key={blog.blogId}
                          to={ROUTES.PUBLIC.BLOG_DETAIL(blog.slug)}
                          onClick={handleResultClick}
                          className='flex items-center gap-3 rounded-lg py-2 transition-colors hover:bg-muted/50'
                        >
                          {/* Thumbnail */}
                          <div className='h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-muted'>
                            <img src={blog.thumbnail} alt={blog.title} className='h-full w-full object-cover' />
                          </div>

                          {/* Title */}
                          <h4 className='line-clamp-2 min-w-0 flex-1 text-sm'>{blog.title}</h4>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className='p-8 text-center text-muted-foreground'>
              <Search className='mx-auto mb-2 h-12 w-12 opacity-50' />
              <p>Không tìm thấy kết quả cho "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchForm
