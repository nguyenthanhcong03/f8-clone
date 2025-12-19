import { Router } from 'express'
import blogController from '../controllers/blog.controller'
import { validate } from '../middleware/validation.middleware'
import { createBlogSchema, createCategorySchema, updateBlogSchema, updateCategorySchema } from '../schemas/blog.schema'
import upload from '../middleware/upload.middleware'
import authMiddleware from '@/middleware/auth.middleware'

const router = Router()

// ===== BLOG CATEGORY ROUTES =====
router.post(
  '/categories',
  authMiddleware.authRequired,
  authMiddleware.checkRole('admin'),
  validate(createCategorySchema),
  blogController.createCategory
)

router.get('/categories', blogController.getAllCategories)

router.get('/categories/:categoryId', blogController.getCategoryById)

router.put(
  '/categories/:categoryId',
  authMiddleware.authRequired,
  authMiddleware.checkRole('admin'),
  validate(updateCategorySchema),
  blogController.updateCategory
)

router.delete(
  '/categories/:categoryId',
  authMiddleware.authRequired,
  authMiddleware.checkRole('admin'),
  blogController.deleteCategory
)

// ===== BLOG ROUTES =====
router.post(
  '/',
  authMiddleware.authRequired,
  authMiddleware.checkRole('admin'),
  upload.single('thumbnail'),
  validate(createBlogSchema),
  blogController.createBlog
)

router.get('/', blogController.getAllBlogs)

router.get('/:blogId', blogController.getBlogById)

router.get('/slug/:slug', blogController.getBlogBySlug)

router.put(
  '/:blogId',
  authMiddleware.authRequired,
  authMiddleware.checkRole('admin'),
  upload.single('thumbnail'),
  validate(updateBlogSchema),
  blogController.updateBlog
)

router.delete('/:blogId', authMiddleware.authRequired, authMiddleware.checkRole('admin'), blogController.deleteBlog)

export default router
