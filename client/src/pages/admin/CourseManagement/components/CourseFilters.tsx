import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, X } from 'lucide-react'
import { useState } from 'react'

interface CourseFiltersProps {
  onFiltersChange: (filters: { search: string; level: string; isPublished: string; isPaid: string }) => void
}

const CourseFilters = ({ onFiltersChange }: CourseFiltersProps) => {
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('all')
  const [isPublished, setIsPublished] = useState('all')
  const [isPaid, setIsPaid] = useState('all')

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFiltersChange({ search: value, level, isPublished, isPaid })
  }

  const handleLevelChange = (value: string) => {
    setLevel(value)
    onFiltersChange({ search, level: value, isPublished, isPaid })
  }

  const handleIsPublishedChange = (value: string) => {
    setIsPublished(value)
    onFiltersChange({ search, level, isPublished: value, isPaid })
  }

  const handleIsPaidChange = (value: string) => {
    setIsPaid(value)
    onFiltersChange({ search, level, isPublished, isPaid: value })
  }

  const clearFilters = () => {
    setSearch('')
    setLevel('all')
    setIsPublished('all')
    setIsPaid('all')
    onFiltersChange({ search: '', level: 'all', isPublished: 'all', isPaid: 'all' })
  }

  const hasActiveFilters = search || level !== 'all' || isPublished !== 'all' || isPaid !== 'all'

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        {/* Tìm kiếm */}
        <div className='relative max-w-sm flex-1'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Tìm kiếm khóa học...'
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className='pl-10'
          />
        </div>

        {/* Bộ lọc */}
        <div className='flex items-center gap-3'>
          {/* Xóa bộ lọc */}
          {hasActiveFilters && (
            <Button variant='outline' size='sm' onClick={clearFilters}>
              <X className='mr-1 h-4 w-4' />
              Xóa lọc
            </Button>
          )}
          <div className='flex items-center gap-2'>
            <Filter className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm font-medium text-muted-foreground'>Lọc:</span>
          </div>

          {/* Mức độ */}
          <Select value={level} onValueChange={handleLevelChange}>
            <SelectTrigger className='w-[130px]'>
              <SelectValue placeholder='Mức độ' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả</SelectItem>
              <SelectItem value='beginner'>Cơ bản</SelectItem>
              <SelectItem value='intermediate'>Trung bình</SelectItem>
              <SelectItem value='advanced'>Nâng cao</SelectItem>
            </SelectContent>
          </Select>

          {/* Trạng thái */}
          <Select value={isPublished} onValueChange={handleIsPublishedChange}>
            <SelectTrigger className='w-[130px]'>
              <SelectValue placeholder='Trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả</SelectItem>
              <SelectItem value='published'>Đã phát hành</SelectItem>
              <SelectItem value='draft'>Bản nháp</SelectItem>
            </SelectContent>
          </Select>

          {/* Loại khóa học */}
          <Select value={isPaid} onValueChange={handleIsPaidChange}>
            <SelectTrigger className='w-[130px]'>
              <SelectValue placeholder='Loại' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả</SelectItem>
              <SelectItem value='free'>Miễn phí</SelectItem>
              <SelectItem value='paid'>Có phí</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-sm text-muted-foreground'>Đang lọc:</span>
          {search && (
            <Badge variant='secondary' className='gap-1'>
              Tìm kiếm: {search}
              <X className='h-3 w-3 cursor-pointer' onClick={() => handleSearchChange('')} />
            </Badge>
          )}
          {level !== 'all' && (
            <Badge variant='secondary' className='gap-1'>
              Mức độ: {level === 'beginner' ? 'Cơ bản' : level === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
              <X className='h-3 w-3 cursor-pointer' onClick={() => handleLevelChange('all')} />
            </Badge>
          )}
          {isPublished !== 'all' && (
            <Badge variant='secondary' className='gap-1'>
              Trạng thái: {isPublished === 'published' ? 'Đã phát hành' : 'Bản nháp'}
              <X className='h-3 w-3 cursor-pointer' onClick={() => handleIsPublishedChange('all')} />
            </Badge>
          )}
          {isPaid !== 'all' && (
            <Badge variant='secondary' className='gap-1'>
              Loại: {isPaid === 'free' ? 'Miễn phí' : 'Có phí'}
              <X className='h-3 w-3 cursor-pointer' onClick={() => handleIsPaidChange('all')} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

export default CourseFilters
