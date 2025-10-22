# Hướng dẫn Chuyển đổi từ createSlice/createAsyncThunk sang RTK Query

## Giới thiệu

Tài liệu này sẽ hướng dẫn cách chuyển đổi code từ Redux Toolkit với createSlice và createAsyncThunk sang RTK Query để quản lý trạng thái và thực hiện các API calls trong ứng dụng React.

## Cấu trúc RTK Query đã được cài đặt

Dự án đã được cấu hình với các API slices sau:

- `baseApi.ts`: API cơ sở chứa cấu hình chung cho các API calls
- `courseApi.ts`: API slice cho các thao tác với khóa học
- `sectionApi.ts`: API slice cho các thao tác với phần học
- `lessonApi.ts`: API slice cho các thao tác với bài học
- `enrollmentApi.ts`: API slice cho các thao tác đăng ký khóa học

## Cách chuyển đổi components

### 1. Thay thế useEffect và createAsyncThunk bằng useQuery

#### Trước kia (createAsyncThunk + useEffect):

```tsx
// Component
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { fetchCourses } from '@/store/features/courses/courseSlice'

const CourseList = () => {
  const dispatch = useAppDispatch()
  const { courses, loading, error } = useAppSelector((state) => state.courses)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
```

#### Bây giờ (RTK Query):

```tsx
// Component
import { useGetCoursesQuery } from '@/store/api/courseApi'

const CourseList = () => {
  const { data, isLoading, isError, error } = useGetCoursesQuery()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error?.message}</div>

  return (
    <div>
      {data?.courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
```

### 2. Chuyển đổi mutation (tạo, cập nhật, xóa dữ liệu)

#### Trước kia (createAsyncThunk):

```tsx
// Component
import { useAppDispatch } from '@/store/hook'
import { createCourse } from '@/store/features/courses/courseSlice'

const CreateCourseForm = () => {
  const dispatch = useAppDispatch()

  const handleSubmit = async (data) => {
    try {
      await dispatch(createCourse(data)).unwrap()
      // Thành công, làm gì đó...
    } catch (error) {
      // Xử lý lỗi
    }
  }

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>
}
```

#### Bây giờ (RTK Query):

```tsx
// Component
import { useCreateCourseMutation } from '@/store/api/courseApi'

const CreateCourseForm = () => {
  const [createCourse, { isLoading, isError, error }] = useCreateCourseMutation()

  const handleSubmit = async (data) => {
    try {
      const result = await createCourse(data).unwrap()
      // Thành công, làm gì đó...
    } catch (error) {
      // Xử lý lỗi
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {isLoading && <div>Submitting...</div>}
      {isError && <div>Error: {error?.message}</div>}
    </form>
  )
}
```

### 3. Xử lý tham số trong query

#### Trước kia:

```tsx
// Component
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { fetchCourseById } from '@/store/features/courses/courseSlice'

const CourseDetails = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const { currentCourse, loading, error } = useAppSelector((state) => state.courses)

  useEffect(() => {
    if (id) {
      dispatch(fetchCourseById(id))
    }
  }, [id, dispatch])

  // Component rendering...
}
```

#### Bây giờ (RTK Query):

```tsx
// Component
import { useParams } from 'react-router-dom'
import { useGetCourseByIdQuery, skipToken } from '@/store/api/courseApi'
import { skipToken } from '@/store/hook'

const CourseDetails = () => {
  const { id } = useParams()
  const { data, isLoading, isError } = useGetCourseByIdQuery(id ?? skipToken)

  // Component rendering với data.course...
}
```

### 4. Xử lý data cache và refetch

Với RTK Query, việc quản lý cache và refetch dữ liệu đã được tự động hóa. Tuy nhiên, có thể cần điều chỉnh một số trường hợp:

```tsx
const {
  data,
  isLoading,
  refetch // Gọi khi cần refresh dữ liệu thủ công
} = useGetCoursesQuery(undefined, {
  pollingInterval: 0, // Tắt polling
  refetchOnMountOrArgChange: true, // Refetch khi component mount
  refetchOnFocus: false, // Không refetch khi cửa sổ focus lại
  skip: false // Có thực hiện query ngay hay không
})
```

### 5. Tích hợp với RTK Query Tags để invalidate cache

RTK Query sử dụng hệ thống tags để quản lý invalidation của cache. Các API slices đã được cấu hình để tự động invalidate cache khi có thay đổi dữ liệu.

Ví dụ, khi tạo một khóa học mới, cache của danh sách khóa học sẽ tự động được invalidate:

```tsx
const CoursePage = () => {
  // Query để lấy danh sách khóa học
  const { data: courses } = useGetCoursesQuery()

  // Mutation để tạo khóa học mới
  const [createCourse] = useCreateCourseMutation()

  const handleCreate = async (data) => {
    await createCourse(data).unwrap()
    // Không cần phải refetch thủ công, RTK Query sẽ tự động
    // invalidate cache của useGetCoursesQuery dựa trên tag system
  }

  // Component rendering...
}
```

## Các tiện ích bổ sung

### 1. Sử dụng các tiện ích từ hooks.ts

```tsx
import { isLoading, isError, skipToken } from '@/store/hook'

const Component = () => {
  const { data, status } = useGetCoursesQuery()

  if (isLoading(status)) return <div>Loading...</div>
  if (isError(status)) return <div>Error occurred</div>

  // Component rendering...
}
```

## Lưu ý khi chuyển đổi

1. **Cấu trúc dữ liệu**: Chú ý cấu trúc dữ liệu từ API trả về có thể khác với cách bạn đã lưu trữ trong Redux store.

2. **Conditional Fetching**: Sử dụng `skipToken` khi cần điều kiện để thực hiện query.

3. **FormData**: Khi làm việc với FormData, các API slice đã được cấu hình để xử lý đúng Content-Type.

4. **Optimistic Updates**: RTK Query hỗ trợ optimistic updates, xem thêm tài liệu để thực hiện nếu cần.

5. **Error Handling**: Xử lý lỗi với `isError` và `error` từ các hooks.

## Tài liệu tham khảo

- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [RTK Query Tutorials](https://redux-toolkit.js.org/tutorials/rtk-query)
