import ApiError from '@/utils/ApiError'
import asyncHandler from '@/utils/asyncHandler'
import { responseHandler } from '@/utils/responseHandler'
import { Request, Response } from 'express'
import { Op } from 'sequelize'
import blogService from '../services/blog.service'
import uploadService from '../services/upload.service'

// ===== BLOG CATEGORY CONTROLLERS =====

const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, slug, description } = req.body

  // Kiểm tra slug trùng
  const existingCategory = await blogService.categoryExistsBySlug(slug)
  if (existingCategory) {
    throw new ApiError(400, 'Slug đã tồn tại, vui lòng nhập slug khác.')
  }

  const category = await blogService.createCategory({ name, slug, description })
  responseHandler(res, 201, 'Tạo thể loại thành công', category)
})

const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, search } = req.query

  const where: Record<string, unknown> = {}
  if (search) {
    where.name = { [Op.like]: `%${search}%` }
  }

  const offset = (Number(page) - 1) * Number(limit)
  const response = await blogService.getAllCategories(where, {
    offset,
    limit: Number(limit),
    order: [['createdAt', 'DESC']]
  })

  const responseData = {
    total: response.total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(response.total / Number(limit)),
    data: response.data
  }

  responseHandler(res, 200, 'Lấy danh sách thể loại thành công', responseData)
})

const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId } = req.params
  const category = await blogService.getCategoryById(categoryId)
  responseHandler(res, 200, 'Lấy thông tin thể loại thành công', category)
})

const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId } = req.params
  const { name, slug, description } = req.body

  // Kiểm tra slug trùng (trừ chính nó)
  if (slug) {
    const existingCategory = await blogService.categoryExistsBySlug(slug)
    if (existingCategory && existingCategory.categoryId !== categoryId) {
      throw new ApiError(400, 'Slug đã tồn tại, vui lòng nhập slug khác.')
    }
  }

  const updatedCategory = await blogService.updateCategory(categoryId, { name, slug, description })
  responseHandler(res, 200, 'Cập nhật thể loại thành công', updatedCategory)
})

const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId } = req.params
  await blogService.deleteCategory(categoryId)
  responseHandler(res, 200, 'Xóa thể loại thành công', null)
})

// ===== BLOG CONTROLLERS =====

const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const { title, slug, content, categoryId, status } = req.body

  // Kiểm tra slug trùng
  const existingBlog = await blogService.existsBySlug(slug)
  if (existingBlog) {
    throw new ApiError(400, 'Slug đã tồn tại, vui lòng nhập slug khác.')
  }

  const blogData: any = {
    title,
    slug,
    content,
    status,
    categoryId: categoryId || null,
    authorId: req.user?.userId as string,
    publishedAt: status === 'published' ? new Date() : null
  }

  // Nếu có file thumbnail được upload
  if (req.file) {
    try {
      const uploadResult = await uploadService.uploadImage(req.file.buffer, 'blog-thumbnails')
      blogData.thumbnail = uploadResult.url
      blogData.thumbnailPublicId = uploadResult.publicId
    } catch (error) {
      throw new ApiError(400, 'Lỗi khi upload thumbnail')
    }
  }

  const blog = await blogService.create(blogData)
  responseHandler(res, 201, 'Tạo bài viết thành công', blog)
})

const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
  const { search, categoryId, status, page = 1, limit = 10, sort = 'createdAt', order = 'DESC' } = req.query

  const where: Record<string, unknown> = {}

  // Tìm kiếm theo tiêu đề
  if (search) {
    where.title = { [Op.like]: `%${search}%` }
  }

  // Lọc theo thể loại
  if (categoryId && categoryId !== 'all') {
    where.categoryId = categoryId
  }

  // Lọc theo trạng thái
  if (status && status !== 'all') {
    where.status = status
  }
  const offset = (Number(page) - 1) * Number(limit)

  const response = await blogService.getAll(where, {
    offset,
    limit: Number(limit),
    order: [[String(sort), String(order).toUpperCase()]]
  })

  const responseData = {
    total: response.total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(response.total / Number(limit)),
    data: response.data
  }

  responseHandler(res, 200, 'Lấy danh sách bài viết thành công', responseData)
})

const getBlogById = asyncHandler(async (req: Request, res: Response) => {
  const { blogId } = req.params
  const blog = await blogService.getById(blogId)
  responseHandler(res, 200, 'Lấy thông tin bài viết thành công', blog)
})

const getBlogBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params
  const blog = await blogService.getBySlug(slug)
  responseHandler(res, 200, 'Lấy thông tin bài viết thành công', blog)
})

const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const { blogId } = req.params
  const { title, slug, content, status, categoryId } = req.body

  // Kiểm tra slug trùng (trừ chính nó)
  if (slug) {
    const existingBlog = await blogService.existsBySlug(slug)
    if (existingBlog && (existingBlog as any).blogId !== blogId) {
      throw new ApiError(400, 'Slug đã tồn tại, vui lòng nhập slug khác.')
    }
  }

  const blogData: any = {
    title,
    slug,
    content,
    categoryId: categoryId || null
  }

  // Nếu có file thumbnail mới
  if (req.file) {
    try {
      // Xóa ảnh cũ nếu có
      const blog = await blogService.getById(blogId)
      if (blog.thumbnailPublicId) {
        await uploadService.deleteFile(blog.thumbnailPublicId)
      }

      // Upload ảnh mới
      const uploadResult = await uploadService.uploadImage(req.file.buffer, 'blog-thumbnails')
      blogData.thumbnail = uploadResult.url
      blogData.thumbnailPublicId = uploadResult.publicId
    } catch (error) {
      throw new ApiError(400, 'Lỗi khi upload thumbnail')
    }
  }

  const updatedBlog = await blogService.update(blogId, blogData)
  responseHandler(res, 200, 'Cập nhật bài viết thành công', updatedBlog)
})

const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const { blogId } = req.params
  await blogService.deleteBlog(blogId)
  responseHandler(res, 200, 'Xóa bài viết thành công', null)
})

export default {
  // Category controllers
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  // Blog controllers
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog
}
