import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { Course } from '@/types/course'
import { AlertCircle, BookOpen, Calendar, CheckCircle2, DollarSign, Tag, Users } from 'lucide-react'
import React from 'react'

type CourseSummaryDialogProps = {
  course: Course
  open: boolean
  onClose: () => void
}

const CourseSummaryDialog: React.FC<CourseSummaryDialogProps> = ({ course, open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <Card className='border-slate-200 bg-white shadow-sm'>
          <CardHeader className='border-b border-slate-100 bg-slate-50'>
            <CardTitle className='flex items-center gap-2 text-slate-900'>
              <BookOpen className='h-5 w-5' />
              Tổng quan khóa học
            </CardTitle>
          </CardHeader>
          <CardContent className='p-4'>
            <div className='space-y-4'>
              {/* Course Status */}
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-slate-600'>Trạng thái</span>
                {course.isPublished ? (
                  <Badge variant='default' className='bg-green-100 text-green-800'>
                    <CheckCircle2 className='mr-1 h-3 w-3' />
                    Đã xuất bản
                  </Badge>
                ) : (
                  <Badge variant='secondary' className='bg-yellow-100 text-yellow-800'>
                    <AlertCircle className='mr-1 h-3 w-3' />
                    Bản nháp
                  </Badge>
                )}
              </div>

              {/* Level */}
              <div className='flex items-center justify-between'>
                <span className='flex items-center gap-2 text-sm font-medium text-slate-600'>
                  <Tag className='h-4 w-4' />
                  Trình độ
                </span>
                <Badge variant='outline' className='text-xs'>
                  <div
                    className={`mr-1 h-2 w-2 rounded-full ${
                      course.level === 'beginner'
                        ? 'bg-green-500'
                        : course.level === 'intermediate'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                  ></div>
                  {course.level === 'beginner' && 'Cơ bản'}
                  {course.level === 'intermediate' && 'Trung cấp'}
                  {course.level === 'advanced' && 'Nâng cao'}
                </Badge>
              </div>

              {/* Price */}
              <div className='flex items-center justify-between'>
                <span className='flex items-center gap-2 text-sm font-medium text-slate-600'>
                  <DollarSign className='h-4 w-4' />
                  Giá
                </span>
                <span className='font-medium text-slate-900'>
                  {course.isPaid && course.price ? `${course.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}
                </span>
              </div>

              <Separator />

              {/* Statistics */}
              <div className='space-y-3'>
                <h5 className='text-sm font-semibold text-slate-900'>Thống kê</h5>

                <div className='flex items-center justify-between'>
                  <span className='flex items-center gap-2 text-sm text-slate-600'>
                    <Users className='h-4 w-4' />
                    Học viên
                  </span>
                  <span className='font-medium text-slate-900'>{course.enrollmentCount || 0}</span>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='flex items-center gap-2 text-sm text-slate-600'>
                    <Calendar className='h-4 w-4' />
                    Ngày tạo
                  </span>
                  <span className='text-sm font-medium text-slate-900'>
                    {course.createdAt ? new Date(course.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='flex items-center gap-2 text-sm text-slate-600'>
                    <Calendar className='h-4 w-4' />
                    Cập nhật
                  </span>
                  <span className='text-sm font-medium text-slate-900'>
                    {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Course Thumbnail Preview */}
              {course.thumbnail && (
                <div className='space-y-2'>
                  <h5 className='text-sm font-semibold text-slate-900'>Ảnh đại diện</h5>
                  <div className='relative'>
                    <img
                      src={course.thumbnail}
                      alt='Course thumbnail'
                      className='h-24 w-full rounded-md border border-slate-200 object-cover'
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export default CourseSummaryDialog
