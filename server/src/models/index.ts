import User from './user.model'
import Course from './course.model'
import Section from './section.model'
import Lesson from './lesson.model'
import Quiz from './quiz.model'
import Roadmap from './roadmap.model'
import RoadmapCourse from './roadmapCourse.model'
import Enrollment from './enrollment.model'
import Blog from './blog.model'
import BlogCategory from './blogCategory.model'
import BlogComment from './blogComment.model'
import Progress from './progress.model'

// Define associations
// User - Course (One-to-Many: User can create many courses)
User.hasMany(Course, { foreignKey: 'createdBy', as: 'courses' })
Course.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' })

// Course - Section (One-to-Many: Course has many sections)
Course.hasMany(Section, { foreignKey: 'courseId', as: 'sections' })
Section.belongsTo(Course, { foreignKey: 'courseId', as: 'course' })

// Section - Lesson (One-to-Many: Section has many lessons)
Section.hasMany(Lesson, { foreignKey: 'sectionId', as: 'lessons' })
Lesson.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' })

// Lesson - Quiz (One-to-Many: Lesson can have many quizzes)
Lesson.hasMany(Quiz, { foreignKey: 'lessonId', as: 'quizzes' })
Quiz.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' })

// Roadmap - Course (Many-to-Many through RoadmapCourse)
Roadmap.belongsToMany(Course, {
  through: RoadmapCourse,
  foreignKey: 'roadmapId',
  otherKey: 'courseId',
  as: 'courses'
})
Course.belongsToMany(Roadmap, {
  through: RoadmapCourse,
  foreignKey: 'courseId',
  otherKey: 'roadmapId',
  as: 'roadmaps'
})

// User - Course (Many-to-Many through Enrollment)
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

// User - Blog (One-to-Many: User can write many blogs)
User.hasMany(Blog, { foreignKey: 'authorId', as: 'blogs' })
Blog.belongsTo(User, { foreignKey: 'authorId', as: 'author' })

// BlogCategory - Blog (One-to-Many: Category can have many blogs)
BlogCategory.hasMany(Blog, { foreignKey: 'categoryId', as: 'blogs' })
Blog.belongsTo(BlogCategory, { foreignKey: 'categoryId', as: 'category' })

// Blog - BlogComment (One-to-Many: Blog can have many comments)
Blog.hasMany(BlogComment, { foreignKey: 'blogId', as: 'comments' })
BlogComment.belongsTo(Blog, { foreignKey: 'blogId', as: 'blog' })

// User - BlogComment (One-to-Many: User can write many comments)
User.hasMany(BlogComment, { foreignKey: 'userId', as: 'comments' })
BlogComment.belongsTo(User, { foreignKey: 'userId', as: 'user' })

User.hasMany(Progress, { foreignKey: 'userId' })
Lesson.hasMany(Progress, { foreignKey: 'lessonId' })

Progress.belongsTo(User, { foreignKey: 'userId' })
Progress.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' })

export { User, Course, Section, Lesson, Quiz, Roadmap, RoadmapCourse, Enrollment, Blog, BlogCategory, BlogComment }
