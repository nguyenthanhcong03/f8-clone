import { Blog, BlogCategory, User, BlogLike } from '@/models'
import ApiError from '@/utils/ApiError'
import uploadService from './upload.service'
import sequelize from '@/config/database'

export const BlogService = {
  // ===== CATEGORY SERVICES =====
  async createCategory(data: { name: string; slug: string; description?: string }) {
    return await BlogCategory.create(data)
  },

  async categoryExistsBySlug(slug: string) {
    const category = await BlogCategory.findOne({ where: { slug } })
    return category
  },

  async getAllCategories(where: any, options: any) {
    const { count, rows } = await BlogCategory.findAndCountAll({
      where,
      limit: options.limit,
      offset: options.offset,
      order: options.order
    })
    return { total: count, data: rows }
  },

  async getCategoryById(categoryId: string) {
    const category = await BlogCategory.findByPk(categoryId)
    if (!category) {
      throw new ApiError(404, 'Thể loại không tồn tại')
    }
    return category
  },

  async updateCategory(categoryId: string, data: { name?: string; slug?: string; description?: string }) {
    const category = await BlogCategory.findByPk(categoryId)
    if (!category) {
      throw new ApiError(404, 'Thể loại không tồn tại')
    }
    await category.update(data)
    return category
  },

  async deleteCategory(categoryId: string) {
    const category = await BlogCategory.findByPk(categoryId)
    if (!category) {
      throw new ApiError(404, 'Thể loại không tồn tại')
    }

    // Kiểm tra xem có blog nào đang sử dụng category này không
    const blogCount = await Blog.count({ where: { categoryId } })
    if (blogCount > 0) {
      throw new ApiError(
        400,
        'Không thể xóa thể loại đang có bài viết. Vui lòng xóa hoặc chuyển thể loại các bài viết trước.'
      )
    }

    await category.destroy()
    return { message: 'Xóa thể loại thành công' }
  },

  // ===== BLOG SERVICES =====
  async create(data: any) {
    return await Blog.create(data)
  },

  async existsBySlug(slug: string) {
    const blog = await Blog.findOne({ where: { slug } })
    return blog
  },

  async getAll(where: any, options: any) {
    const { count, rows } = await Blog.findAndCountAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['userId', 'name', 'avatar'] },
        { model: BlogCategory, as: 'category', attributes: ['categoryId', 'name', 'slug'] }
      ],
      limit: options.limit,
      offset: options.offset,
      order: options.order
    })
    return { total: count, data: rows }
  },

  async getById(blogId: string) {
    const blog = await Blog.findByPk(blogId, {
      include: [
        { model: User, as: 'author', attributes: ['userId', 'name', 'avatar'] },
        { model: BlogCategory, as: 'category', attributes: ['categoryId', 'name', 'slug', 'description'] }
      ]
    })

    if (!blog) {
      throw new ApiError(404, 'Bài viết không tồn tại')
    }
    return blog
  },

  async getBySlug(slug: string) {
    const blog = await Blog.findOne({
      where: { slug },
      include: [
        { model: User, as: 'author', attributes: ['userId', 'name', 'avatar'] },
        { model: BlogCategory, as: 'category', attributes: ['categoryId', 'name', 'slug', 'description'] }
      ]
    })

    if (!blog) {
      throw new ApiError(404, 'Bài viết không tồn tại')
    }
    return blog
  },

  async update(blogId: string, data: any) {
    const blog = await Blog.findByPk(blogId)
    if (!blog) {
      throw new ApiError(404, 'Bài viết không tồn tại')
    }
    await blog.update(data)
    return blog
  },

  async deleteBlog(blogId: string) {
    const blog = await Blog.findByPk(blogId)
    if (!blog) {
      throw new ApiError(404, 'Bài viết không tồn tại')
    }

    // Xóa thumbnail nếu có
    if (blog.thumbnailPublicId) {
      await uploadService.deleteFile(blog.thumbnailPublicId)
    }

    await blog.destroy()
    return { message: 'Xóa bài viết thành công' }
  },

  // Like bài viết
  async likeBlog(userId: string, blogId: string) {
    // Kiểm tra blog có tồn tại không
    const blog = await Blog.findByPk(blogId)
    if (!blog) {
      throw new ApiError(404, 'Bài viết không tồn tại')
    }

    // Kiểm tra đã like chưa
    const existingLike = await BlogLike.findOne({ where: { userId, blogId } })
    if (existingLike) {
      throw new ApiError(400, 'Bạn đã like bài viết này rồi')
    }

    // Tạo like mới
    const like = await BlogLike.create({ userId, blogId })
    await blog.increment('likesCount', { by: 1 })
    return like
  },

  // Unlike bài viết
  async unlikeBlog(userId: string, blogId: string) {
    // Kiểm tra blog có tồn tại không
    const blog = await Blog.findByPk(blogId)
    if (!blog) {
      throw new ApiError(404, 'Bài viết không tồn tại')
    }

    // Tìm like
    const like = await BlogLike.findOne({ where: { userId, blogId } })
    if (!like) {
      throw new ApiError(400, 'Bạn chưa like bài viết này')
    }

    // Xóa like
    await like.destroy()
    await blog.decrement('likesCount', { by: 1 })
    return { message: 'Đã bỏ like bài viết' }
  },

  async checkLikeStatus(userId: string, blogId: string) {
    const like = await BlogLike.findOne({ where: { userId, blogId } })
    return { isLiked: !!like }
  },

  async getLikedBlogs(userId: string, options: any) {
    const { count, rows } = await Blog.findAndCountAll({
      include: [
        {
          model: User,
          as: 'likedByUsers',
          where: { userId },
          attributes: [], // Không cần lấy thuộc tính của User
          through: { attributes: [] } // Không lấy thuộc tính từ bảng trung gian (blogLike)
        },
        { model: User, as: 'author', attributes: ['userId', 'name', 'avatar'] },
        { model: BlogCategory, as: 'category', attributes: ['categoryId', 'name', 'slug'] }
      ],
      limit: options.limit,
      offset: options.offset,
      order: options.order,
      distinct: true
    })
    return { total: count, data: rows }
  },

  async getBlogLikeCount(blogId: string) {
    const count = await BlogLike.count({ where: { blogId } })
    return count
  }
}

export default BlogService
