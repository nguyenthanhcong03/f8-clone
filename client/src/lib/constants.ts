export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    ROADMAP: '/roadmap',
    COURSES: {
      LIST: '/courses',
      DETAIL: (slug: string = ':slug') => `/courses/${slug}`
    },
    BLOGS: {
      LIST: '/blogs',
      DETAIL: (slug: string = ':slug') => `/blogs/${slug}`,
      BY_TOPIC: (topicSlug: string = ':topicSlug') => `/blogs/topic/${topicSlug}`
    },
    PROFILE: (username: string = ':username') => `/${username}`
  },

  STUDENT: {
    LEARNING: (slug: string = ':slug') => `/learning/${slug}`,
    LIKED_BLOGS: '/liked-blogs',
    MY_COURSES: '/my-courses',
    MY_POSTS: '/my-posts',
    BLOG: {
      CREATE: '/blog/create',
      EDIT: (slug: string = ':slug') => `/blog/${slug}/edit`
    },
    PROFILE: {
      EDIT: '/profile/edit'
    }
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
      VIEW: (blogId: string = ':blogId') => `/admin/blogs/view/${blogId}`
    },

    BLOG_CATEGORIES: {
      ROOT: '/admin/blog-categories',
      CREATE: '/admin/blog-categories/create',
      EDIT: (categoryId: string = ':categoryId') => `/admin/blog-categories/edit/${categoryId}`
    },

    USERS: {
      ROOT: '/admin/users'
    }
  }
} as const
