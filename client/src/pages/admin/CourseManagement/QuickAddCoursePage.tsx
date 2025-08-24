import { courseFormSchema, type CourseFormInput } from '@/schemas/course.schema'
import { createCourse } from '@/store/courseSlice'
import { useAppDispatch } from '@/store/hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowBack as ArrowBackIcon, Image as ImageIcon, Save as SaveIcon } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { Editor } from '@tinymce/tinymce-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

const QuickAddCoursePage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
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

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity })
  }

  const onSubmit = async (data: CourseFormInput) => {
    try {
      // Convert form data to create course format
      const courseData = {
        ...data,
        price: data.is_paid ? (typeof data.price === 'string' ? parseFloat(data.price) : data.price) : undefined
      }
      console.log('course Data:', courseData)

      await dispatch(createCourse(courseData)).unwrap()
      showSnackbar('Course created successfully!', 'success')
      setTimeout(() => {
        navigate('/admin/courses')
      }, 1500)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create course'
      showSnackbar(errorMessage, 'error')
    }
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/courses')} variant='outlined'>
          Back to Courses
        </Button>
        <Typography variant='h4' component='h1'>
          Add New Course
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Basic Information */}
              <Box>
                <Typography variant='h6' sx={{ mb: 2, color: 'primary.main' }}>
                  Thông tin khóa học
                </Typography>

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

                  <Controller
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
                  />

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

              <Divider />

              {/* Pricing */}
              <Box>
                <Typography variant='h6' sx={{ mb: 2, color: 'primary.main' }}>
                  Pricing
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Controller
                    name='is_paid'
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label='This is a paid course'
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
                          label='Price *'
                          type='number'
                          inputProps={{ min: 0, step: 0.01 }}
                          error={!!errors.price}
                          helperText={errors.price?.message}
                          placeholder='0.00'
                          sx={{ maxWidth: 300 }}
                        />
                      )}
                    />
                  )}
                </Box>
              </Box>

              <Divider />

              {/* Thumbnail */}
              <Box>
                <Typography variant='h6' sx={{ mb: 2, color: 'primary.main' }}>
                  Course Thumbnail
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
                          startIcon={<ImageIcon />}
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
                            ? `Selected: ${value instanceof File ? value.name : 'Current thumbnail'}`
                            : 'Click to upload thumbnail'}
                        </Button>
                      </label>
                      {errors.thumbnail && (
                        <Typography variant='body2' color='error' sx={{ mt: 1 }}>
                          {errors.thumbnail.message}
                        </Typography>
                      )}
                      {!errors.thumbnail && (
                        <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                          Supported formats: JPEG, PNG, WebP (Max 5MB)
                        </Typography>
                      )}
                    </Box>
                  )}
                />
              </Box>

              <Divider />

              {/* Form Actions */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                <Button variant='outlined' onClick={() => navigate('/admin/courses')} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting}
                  sx={{ minWidth: 120 }}
                >
                  {isSubmitting ? 'Creating...' : 'Create Course'}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default QuickAddCoursePage
