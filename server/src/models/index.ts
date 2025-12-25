import User from './user.model'
import Course from './course.model'
import Section from './section.model'
import Lesson from './lesson.model'
import Quiz from './quiz.model'
import Enrollment from './enrollment.model'
import Progress from './progress.model'
import Blog from './blog.model'
import BlogCategory from './blogCategory.model'
import BlogComment from './blogComment.model'
import BlogLike from './blogLike.model'

// ===== QUAN HỆ LIÊN QUAN ĐẾN KHÓA HỌC =====

// User - Course (Một-Nhiều: User có thể tạo nhiều khóa học)
User.hasMany(Course, { foreignKey: 'createdBy', as: 'courses' })
Course.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' })

// Course - Section (Một-Nhiều: Khóa học có nhiều phần)
Course.hasMany(Section, { foreignKey: 'courseId', as: 'sections' })
Section.belongsTo(Course, { foreignKey: 'courseId', as: 'course' })

// Section - Lesson (Một-Nhiều: Phần có nhiều bài học)
Section.hasMany(Lesson, { foreignKey: 'sectionId', as: 'lessons' })
Lesson.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' })

// Lesson - Quiz (Một-Nhiều: Bài học có nhiều bài kiểm tra)
Lesson.hasMany(Quiz, { foreignKey: 'lessonId', as: 'quizzes' })
Quiz.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' })

// User - Course (Nhiều-Nhiều thông qua Enrollment)
User.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: 'userId',
  otherKey: 'courseId',
  as: 'enrolledCourses'
})
Course.belongsToMany(User, {
  through: Enrollment,
  foreignKey: 'courseId',
  otherKey: 'userId',
  as: 'enrolledUsers'
})

// Enrollment - User (Nhiều-Một: Enrollment thuộc về User)
Enrollment.belongsTo(User, { foreignKey: 'userId', as: 'user' })
User.hasMany(Enrollment, { foreignKey: 'userId', as: 'enrollments' })

// Enrollment - Course (Nhiều-Một: Enrollment thuộc về Course)
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' })
Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'enrollments' })

// User - Progress (Một-Nhiều: User có nhiều bản ghi tiến độ)
User.hasMany(Progress, { foreignKey: 'userId', as: 'progress' })
Progress.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// Lesson - Progress (Một-Nhiều: Bài học có nhiều bản ghi tiến độ)
Lesson.hasMany(Progress, { foreignKey: 'lessonId', as: 'progress' })
Progress.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' })

// ===== QUAN HỆ LIÊN QUAN ĐẾN BLOG =====

// User - Blog (Một-Nhiều: User có thể viết nhiều blog)
User.hasMany(Blog, { foreignKey: 'authorId', as: 'blogs' })
Blog.belongsTo(User, { foreignKey: 'authorId', as: 'author' })

// BlogCategory - Blog (Một-Nhiều: Thể loại có nhiều blog)
BlogCategory.hasMany(Blog, { foreignKey: 'categoryId', as: 'blogs' })
Blog.belongsTo(BlogCategory, { foreignKey: 'categoryId', as: 'category' })

// Blog - BlogComment (Một-Nhiều: Blog có nhiều bình luận)
Blog.hasMany(BlogComment, { foreignKey: 'blogId', as: 'comments' })
BlogComment.belongsTo(Blog, { foreignKey: 'blogId', as: 'blog' })

// User - BlogComment (Một-Nhiều: User có thể viết nhiều bình luận)
User.hasMany(BlogComment, { foreignKey: 'userId', as: 'blogComments' })
BlogComment.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// User - Blog (Nhiều-Nhiều thông qua BlogLike)
User.belongsToMany(Blog, {
  through: BlogLike,
  foreignKey: 'userId',
  otherKey: 'blogId',
  as: 'likedBlogs'
})
Blog.belongsToMany(User, {
  through: BlogLike,
  foreignKey: 'blogId',
  otherKey: 'userId',
  as: 'likedByUsers'
})

// BlogLike associations
BlogLike.belongsTo(User, { foreignKey: 'userId', as: 'user' })
BlogLike.belongsTo(Blog, { foreignKey: 'blogId', as: 'blog' })
User.hasMany(BlogLike, { foreignKey: 'userId', as: 'blogLikes' })
Blog.hasMany(BlogLike, { foreignKey: 'blogId', as: 'likes' })

export { User, Course, Section, Lesson, Quiz, Enrollment, Progress, Blog, BlogCategory, BlogComment, BlogLike }
