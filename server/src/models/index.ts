import User from './user.model'
import Course from './course.model'
import Section from './section.model'
import Lesson from './lesson.model'
import Quiz from './quiz.model'
import Roadmap from './roadmap.model'
import RoadmapCourse from './roadmapCourse.model'
import Enrollment from './enrollment.model'
import Blog from './blog.model'
import BlogComment from './blogComment.model'
import Assignment from './assignment.model'

// Define associations
// User - Course (One-to-Many: User can create many courses)
User.hasMany(Course, { foreignKey: 'created_by', as: 'courses' })
Course.belongsTo(User, { foreignKey: 'created_by', as: 'creator' })

// Course - Section (One-to-Many: Course has many sections)
Course.hasMany(Section, { foreignKey: 'course_id', as: 'sections' })
Section.belongsTo(Course, { foreignKey: 'course_id', as: 'course' })

// Section - Lesson (One-to-Many: Section has many lessons)
Section.hasMany(Lesson, { foreignKey: 'section_id', as: 'lessons' })
Lesson.belongsTo(Section, { foreignKey: 'section_id', as: 'section' })

// Lesson - Quiz (One-to-Many: Lesson can have many quizzes)
Lesson.hasMany(Quiz, { foreignKey: 'lesson_id', as: 'quizzes' })
Quiz.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' })

// Lesson - Assignment (One-to-Many: Lesson can have many assignments)
Lesson.hasMany(Assignment, { foreignKey: 'lesson_id', as: 'assignments' })
Assignment.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' })

// Roadmap - Course (Many-to-Many through RoadmapCourse)
Roadmap.belongsToMany(Course, {
  through: RoadmapCourse,
  foreignKey: 'roadmap_id',
  otherKey: 'course_id',
  as: 'courses'
})
Course.belongsToMany(Roadmap, {
  through: RoadmapCourse,
  foreignKey: 'course_id',
  otherKey: 'roadmap_id',
  as: 'roadmaps'
})

// User - Course (Many-to-Many through Enrollment)
User.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: 'user_id',
  otherKey: 'course_id',
  as: 'enrolledCourses'
})
Course.belongsToMany(User, {
  through: Enrollment,
  foreignKey: 'course_id',
  otherKey: 'user_id',
  as: 'enrolledUsers'
})

// User - Blog (One-to-Many: User can write many blogs)
User.hasMany(Blog, { foreignKey: 'author_id', as: 'blogs' })
Blog.belongsTo(User, { foreignKey: 'author_id', as: 'author' })

// Blog - BlogComment (One-to-Many: Blog can have many comments)
Blog.hasMany(BlogComment, { foreignKey: 'blog_id', as: 'comments' })
BlogComment.belongsTo(Blog, { foreignKey: 'blog_id', as: 'blog' })

// User - BlogComment (One-to-Many: User can write many comments)
User.hasMany(BlogComment, { foreignKey: 'user_id', as: 'comments' })
BlogComment.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

export { User, Course, Section, Lesson, Quiz, Roadmap, RoadmapCourse, Enrollment, Blog, BlogComment, Assignment }
