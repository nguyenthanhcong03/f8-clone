import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { useState } from 'react'

interface BlogCategoryFiltersProps {
  onFiltersChange: (filters: { search: string }) => void
}

const BlogCategoryFilters = ({ onFiltersChange }: BlogCategoryFiltersProps) => {
  const [search, setSearch] = useState('')

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFiltersChange({ search: value })
  }

  return (
    <div className='flex items-center gap-4'>
      {/* Search */}
      <div className='relative max-w-md flex-1'>
        <SearchIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          placeholder='Tìm kiếm thể loại...'
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className='pl-9'
        />
      </div>
    </div>
  )
}

export default BlogCategoryFilters
