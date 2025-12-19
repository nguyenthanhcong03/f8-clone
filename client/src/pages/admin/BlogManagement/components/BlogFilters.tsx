import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetAllCategoriesQuery } from '@/services/api/blogApi'
import { SearchIcon } from 'lucide-react'
import { useState } from 'react'

interface BlogFiltersProps {
  onFiltersChange: (filters: { search: string; categoryId: string; status: string }) => void
}

const BlogFilters = ({ onFiltersChange }: BlogFiltersProps) => {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('all')
  const [status, setStatus] = useState('all')

  // Lấy danh sách category từ API
  const { data: categoriesData } = useGetAllCategoriesQuery({ limit: 50 })
  const categories = categoriesData?.data?.data || []

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFiltersChange({ search: value, categoryId, status })
  }

  const handleCategoryChange = (value: string) => {
    setCategoryId(value)
    onFiltersChange({ search, categoryId: value, status })
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    onFiltersChange({ search, categoryId, status: value })
  }

  return (
    <div className='rounded-lg border bg-card p-4'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {/* Search */}
        <div className='space-y-2'>
          <Label htmlFor='search'>Tìm kiếm</Label>
          <div className='relative'>
            <SearchIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              id='search'
              placeholder='Tìm theo tiêu đề...'
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className='pl-9'
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className='space-y-2'>
          <Label htmlFor='category'>Thể loại</Label>
          <Select value={categoryId} onValueChange={handleCategoryChange}>
            <SelectTrigger id='category'>
              <SelectValue placeholder='Chọn thể loại' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả thể loại</SelectItem>
              {categories.map((category: any) => (
                <SelectItem key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className='space-y-2'>
          <Label htmlFor='status'>Trạng thái</Label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger id='status'>
              <SelectValue placeholder='Chọn trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả trạng thái</SelectItem>
              <SelectItem value='draft'>Bản nháp</SelectItem>
              <SelectItem value='published'>Đã xuất bản</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default BlogFilters
