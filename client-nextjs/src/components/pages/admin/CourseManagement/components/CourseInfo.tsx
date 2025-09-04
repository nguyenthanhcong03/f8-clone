import { courseFormSchema, type CourseFormInput } from '@/schemas/course.schema'
import { createCourse } from '@/store/courseSlice'
import { useAppDispatch } from '@/store/hook'
import { showSnackbar } from '@/store/snackbarSlice'
import type { Course } from '@/types/course'
import { zodResolver } from '@hookform/resolvers/zod'
import { Image } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { Editor } from '@tinymce/tinymce-react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

interface CourseDetailsProps {
  course: Course | null
}

const CourseInfo: React.FC<CourseDetailsProps> = ({ course }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<CourseFormInput>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      level: 'beginner',
      is_paid: false,
      price: 0,
      thumbnail: undefined
    }
  })

  const isPaidValue = watch('is_paid')

  const onSubmit = async (data: CourseFormInput) => {
    try {
      // Convert form data to create course format
      const courseData = {
        ...data,
        price: data.is_paid ? (typeof data.price === 'string' ? parseFloat(data.price) : data.price) : undefined
      }
      console.log('course Data:', courseData)

      await dispatch(createCourse(courseData)).unwrap()
      showSnackbar({ message: 'Course created successfully!', severity: 'success' })
      setTimeout(() => {
        navigate('/admin/courses')
      }, 1500)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create course'
      showSnackbar({ message: errorMessage, severity: 'error' })
    }
  }

  return (
    <Card variant='outlined' sx={{ mb: 4 }}>
      <CardHeader title='Thông tin khóa học' subheader='Cung cấp thông tin cơ bản của khóa học' />
      <CardContent>
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name='title'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Tên khóa học'
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  placeholder='Nhập tên khóa học'
                />
              )}
            />

            {/* <Controller
              name='description'
              control={control}
              render={({ field: { onChange, value } }) => (
                <Editor
                  apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: ['link', 'image', 'code', 'lists', 'table'],
                    toolbar:
                      'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image | code'
                  }}
                  value={value}
                  onEditorChange={(content) => {
                    onChange(content)
                  }}
                />
              )}
            /> */}

            <Controller
              name='level'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.level}>
                  <InputLabel>Level</InputLabel>
                  <Select {...field} label='Level'>
                    <MenuItem value='beginner'>Cơ bản</MenuItem>
                    <MenuItem value='intermediate'>Trung cấp</MenuItem>
                    <MenuItem value='advanced'>Nâng cao</MenuItem>
                  </Select>
                  {errors.level && <FormHelperText>{errors.level.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Box>
        </Box>

        <Divider sx={{ mt: 3, mb: 1 }} />

        {/* Pricing */}
        <Box>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Trả phí
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name='is_paid'
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label='Đây là khóa học trả phí'
                  sx={{ width: 'fit-content' }}
                />
              )}
            />

            {isPaidValue && (
              <Controller
                name='price'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Price'
                    type='number'
                    inputProps={{ min: 0, step: 1000 }}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    placeholder='0.00'
                  />
                )}
              />
            )}
          </Box>
        </Box>

        <Divider sx={{ mt: 3, mb: 1 }} />

        <Box>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Hình ảnh minh họa
          </Typography>

          <Controller
            name='thumbnail'
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <Box>
                <input
                  {...field}
                  type='file'
                  accept='image/*'
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    onChange(file)
                  }}
                  style={{ display: 'none' }}
                  id='thumbnail-upload'
                />
                <label htmlFor='thumbnail-upload'>
                  <Button
                    variant='outlined'
                    component='span'
                    startIcon={<Image />}
                    sx={{
                      minHeight: 56,
                      width: '100%',
                      maxWidth: 400,
                      border: errors.thumbnail ? '2px solid' : '1px solid',
                      borderColor: errors.thumbnail ? 'error.main' : 'divider',
                      borderStyle: 'dashed'
                    }}
                  >
                    {value
                      ? `Đã chọn: ${value instanceof File ? value.name : 'Current thumbnail'}`
                      : 'Chọn hình ảnh minh họa'}
                  </Button>
                </label>
                {errors.thumbnail && (
                  <Typography variant='body2' color='error' sx={{ mt: 1 }}>
                    {errors.thumbnail.message}
                  </Typography>
                )}
                {!errors.thumbnail && (
                  <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                    Định dạng: JPEG, PNG, WebP (Tối đa 5MB)
                  </Typography>
                )}
              </Box>
            )}
          />
        </Box>
        <Stack direction='row' spacing={2} justifyContent='flex-end' sx={{ mt: 3 }}>
          {isDirty && <Button variant='outlined'>Khôi phục</Button>}
          <Button
            variant='contained'
            color='primary'
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            sx={{ minWidth: 150 }}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu thông tin'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default CourseInfo
