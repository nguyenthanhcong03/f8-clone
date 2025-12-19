import type { ApiResponse, PaginationResponse } from '@/types/api'
import type { Blog, BlogCategory, CreateBlogData, UpdateBlogData } from '@/types/blog'
import { baseApi } from './baseApi'

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===== BLOG CATEGORY ENDPOINTS =====

    // Lấy tất cả thể loại
    getAllCategories: builder.query<
      ApiResponse<PaginationResponse<BlogCategory>>,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: '/blogs/categories',
        method: 'GET',
        params: {
          page: params.page || 1,
          limit: params.limit || 50,
          search: params.search
        }
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ categoryId }) => ({ type: 'BlogCategory' as const, id: categoryId })),
              { type: 'BlogCategory', id: 'LIST' }
            ]
          : [{ type: 'BlogCategory', id: 'LIST' }]
    }),

    // Lấy thể loại theo ID
    getCategoryById: builder.query<ApiResponse<BlogCategory>, string>({
      query: (categoryId) => `/blogs/categories/${categoryId}`,
      providesTags: (result) => (result?.data ? [{ type: 'BlogCategory', id: result.data.categoryId }] : [])
    }),

    // Tạo thể loại mới
    createCategory: builder.mutation<ApiResponse<BlogCategory>, { name: string; slug: string; description?: string }>({
      query: (data) => ({
        url: '/blogs/categories',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'BlogCategory', id: 'LIST' }]
    }),

    // Cập nhật thể loại
    updateCategory: builder.mutation<
      ApiResponse<BlogCategory>,
      { id: string; data: { name?: string; slug?: string; description?: string } }
    >({
      query: ({ id, data }) => ({
        url: `/blogs/categories/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'BlogCategory', id },
        { type: 'BlogCategory', id: 'LIST' }
      ]
    }),

    // Xóa thể loại
    deleteCategory: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/blogs/categories/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'BlogCategory', id: 'LIST' }]
    }),

    // ===== BLOG ENDPOINTS =====

    // Lấy tất cả blog
    getAllBlogs: builder.query<
      ApiResponse<PaginationResponse<Blog>>,
      {
        page: number
        limit: number
        sort: string
        order: string
        search?: string
        categoryId?: string
      }
    >({
      query: (params) => ({
        url: '/blogs',
        method: 'GET',
        params: params
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ blogId }) => ({ type: 'Blog' as const, id: blogId })),
              { type: 'Blog', id: 'LIST' }
            ]
          : [{ type: 'Blog', id: 'LIST' }]
    }),

    // Lấy blog theo ID
    getBlogById: builder.query<ApiResponse<Blog>, string>({
      query: (blogId) => `/blogs/${blogId}`,
      providesTags: (result) => (result?.data ? [{ type: 'Blog', id: result.data.blogId }] : [])
    }),

    // Lấy blog theo slug
    getBlogBySlug: builder.query<ApiResponse<Blog>, string>({
      query: (slug) => `/blogs/slug/${slug}`,
      providesTags: (result) => (result?.data ? [{ type: 'Blog', id: result.data.blogId }] : [])
    }),

    // Tạo blog mới
    createBlog: builder.mutation<ApiResponse<Blog>, CreateBlogData | FormData>({
      query: (blogData) => ({
        url: '/blogs',
        method: 'POST',
        body: blogData,
        formData: blogData instanceof FormData
      }),
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }]
    }),

    // Cập nhật blog
    updateBlog: builder.mutation<ApiResponse<Blog>, { id: string; data: UpdateBlogData | FormData }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: 'PUT',
        body: data,
        formData: data instanceof FormData
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' }
      ]
    }),

    // Xóa blog
    deleteBlog: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }]
    }),

    // ===== BLOG LIKE ENDPOINTS =====

    // Like blog
    likeBlog: builder.mutation<ApiResponse<any>, string>({
      query: (blogId) => ({
        url: `/blogs/${blogId}/like`,
        method: 'POST'
      }),
      invalidatesTags: (_result, _error, blogId) => [
        { type: 'Blog', id: blogId },
        { type: 'Blog', id: 'LIKED_LIST' }
      ]
    }),

    // Unlike blog
    unlikeBlog: builder.mutation<ApiResponse<null>, string>({
      query: (blogId) => ({
        url: `/blogs/${blogId}/like`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, blogId) => [
        { type: 'Blog', id: blogId },
        { type: 'Blog', id: 'LIKED_LIST' }
      ]
    }),

    // Kiểm tra trạng thái like
    checkLikeStatus: builder.query<ApiResponse<{ isLiked: boolean }>, string>({
      query: (blogId) => `/blogs/${blogId}/like-status`,
      providesTags: (_result, _error, blogId) => [{ type: 'Blog', id: `LIKE_${blogId}` }]
    }),

    // Lấy danh sách blog đã like
    getLikedBlogs: builder.query<
      ApiResponse<PaginationResponse<Blog>>,
      { page?: number; limit?: number; sort?: string; order?: string }
    >({
      query: (params) => ({
        url: '/blogs/liked/me',
        method: 'GET',
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          sort: params.sort || 'createdAt',
          order: params.order || 'DESC'
        }
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ blogId }) => ({ type: 'Blog' as const, id: blogId })),
              { type: 'Blog', id: 'LIKED_LIST' }
            ]
          : [{ type: 'Blog', id: 'LIKED_LIST' }]
    })
  })
})

// Export hooks
export const {
  // Category hooks
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  // Blog hooks
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useGetBlogBySlugQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  // Blog Like hooks
  useLikeBlogMutation,
  useUnlikeBlogMutation,
  useCheckLikeStatusQuery,
  useGetLikedBlogsQuery
} = blogApi
