import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '@/store/store'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { fetchCourses, deleteCourse, clearError } from '@/store/courseSlice'
import type { Course, CourseLevel } from '@/types/course'

const levelColors: Record<CourseLevel, 'success' | 'warning' | 'error'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error'
}

const CoursePage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { courses, loading, error } = useSelector((state: RootState) => state.courses)

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      showSnackbar(error, 'error')
      dispatch(clearError())
    }
  }, [error, dispatch])

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleAddCourse = () => {
    navigate('/admin/courses/add')
  }

  const handleEditCourse = (course: Course) => {
    // TODO: Navigate to edit page when created
    showSnackbar('Edit functionality coming soon', 'info' as any)
  }

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return

    try {
      await dispatch(deleteCourse(courseToDelete.id)).unwrap()
      showSnackbar('Course deleted successfully', 'success')
      setDeleteDialogOpen(false)
      setCourseToDelete(null)
    } catch {
      showSnackbar('Failed to delete course', 'error')
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h4' component='h1'>
          Course Management
        </Typography>
        <Button variant='contained' startIcon={<AddIcon />} onClick={handleAddCourse} sx={{ minWidth: 150 }}>
          Add Course
        </Button>
      </Box>

      {/* Courses Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align='center' sx={{ py: 4 }}>
                    <Typography variant='body1' color='text.secondary'>
                      No courses found. Click "Add Course" to create your first course.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant='body1' fontWeight='medium'>
                          {course.title}
                        </Typography>
                        {course.description && (
                          <Typography variant='body2' color='text.secondary' noWrap>
                            {course.description}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' fontFamily='monospace'>
                        {course.slug}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={course.level}
                        color={levelColors[course.level]}
                        size='small'
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={course.is_paid ? 'Paid' : 'Free'}
                        color={course.is_paid ? 'primary' : 'default'}
                        variant={course.is_paid ? 'filled' : 'outlined'}
                        size='small'
                      />
                    </TableCell>
                    <TableCell>
                      {course.is_paid && course.price ? (
                        <Typography variant='body2' fontWeight='medium'>
                          ${course.price.toFixed(2)}
                        </Typography>
                      ) : (
                        <Typography variant='body2' color='text.secondary'>
                          Free
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      <IconButton onClick={() => handleEditCourse(course)} color='primary' size='small'>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(course)} color='error' size='small'>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Course</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default CoursePage
