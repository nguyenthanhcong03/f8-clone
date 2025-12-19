import { Router } from 'express'
import blogController from '../controllers/blog.controller'
import { validate } from '../middleware/validation.middleware'
import { createBlogSchema, createCategorySchema, updateBlogSchema, updateCategorySchema } from '../schemas/blog.schema'
import upload from '../middleware/upload.middleware'
import authMiddleware from '@/middleware/auth.middleware'

const router = Router()

// Tạo mới thể loại blog
router.post(
  '/categories',
  authMiddleware.authRequired,
  authMiddleware.checkRole('admin'),
  validate(createCategorySchema),
  blogController.createCategory
)

// Lấy tất cả thể loại blog
router.get('/categories', blogController.getAllCategories)

// Lấy thể loại blog theo ID
router.get('/categories/:categoryId', blogController.getCategoryById)

// Chỉnh sửa thể loại blog
router.put(
  '/categories/:categoryId',
  authMiddleware.authRequired,
  authMiddleware.checkRole('admin'),
  validate(updateCategorySchema),
  blogController.updateCategory
)

// Xóa thể loại blog
router.delete(
  '/categories/:categoryId',
  authMiddleware.authRequired,
  authMiddleware.checkRole('admin'),
  blogController.deleteCategory
)

// Tạo mới blog
router.post(
  '/',
  authMiddleware.authRequired,
  authMiddleware.checkRole('admin'),
  upload.single('thumbnail'),
  validate(createBlogSchema),
  blogController.createBlog
)

// Lấy tất cả blog mà user đã like (đặt trước các routes động)
router.get('/liked/me', authMiddleware.authRequired, blogController.getLikedBlogs)

// Lấy tất cả blog
router.get('/', blogController.getAllBlogs)

// Lấy blog theo slug (đặt trước :blogId để tránh conflict)
router.get('/slug/:slug', blogController.getBlogBySlug)

// Lấy blog theo ID
router.get('/:blogId', blogController.getBlogById)

// Cập nhật blog
router.put(
  '/:blogId',
  authMiddleware.authRequired,
  authMiddleware.checkRole('admin'),
  upload.single('thumbnail'),
  validate(updateBlogSchema),
  blogController.updateBlog
)

// Xóa blog
router.delete('/:blogId', authMiddleware.authRequired, authMiddleware.checkRole('admin'), blogController.deleteBlog)

// Like blog
router.post('/:blogId/like', authMiddleware.authRequired, blogController.likeBlog)

// Unlike blog
router.delete('/:blogId/like', authMiddleware.authRequired, blogController.unlikeBlog)

// Kiểm tra người dùng đã like blog chưa
router.get('/:blogId/like-status', authMiddleware.authRequired, blogController.checkLikeStatus)

export default router
