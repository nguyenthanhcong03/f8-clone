export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    ROADMAP: '/roadmap',
    BLOGS: {
      LIST: '/blogs',
      DETAIL: (slug: string = ':slug') => `/blogs/${slug}`
    },
    COURSE_DETAIL: (slug: string = ':slug') => `/${slug}`
  },

  STUDENT: {
    LEARNING: (slug: string = ':slug') => `/learning/${slug}`,
    PROFILE: '/profile',
    LIKED_BLOGS: '/liked-blogs'
  },

  ADMIN: {
    ROOT: '/admin',

    DASHBOARD: '/admin/dashboard',

    COURSES: {
      ROOT: '/admin/courses',
      CREATE: '/admin/courses/create',
      EDIT: (courseId: string = ':courseId') => `/admin/courses/${courseId}`,
      EDIT_STRUCTURE: (courseId: string = ':courseId') => `/admin/courses/edit-structure/${courseId}`,
      EDIT_LESSON: (courseId: string = ':courseId', sectionId: string = ':sectionId', lessonId: string = ':lessonId') =>
        `/admin/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`
    },

    BLOGS: {
      ROOT: '/admin/blogs',
      CREATE: '/admin/blogs/create',
      EDIT: (blogId: string = ':blogId') => `/admin/blogs/${blogId}`,
      VIEW: (blogId: string = ':blogId') => `/admin/blogs/view/${blogId}`
    },

    BLOG_CATEGORIES: {
      ROOT: '/admin/blog-categories',
      CREATE: '/admin/blog-categories/create',
      EDIT: (categoryId: string = ':categoryId') => `/admin/blog-categories/edit/${categoryId}`
    }
  }
} as const
