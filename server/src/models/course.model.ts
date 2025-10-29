import { CourseAttributes, CreateCourseData } from '@/types/course.types'
import { DataTypes, Model } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import sequelize from '../config/database'

class Course extends Model<CourseAttributes, CreateCourseData> implements CourseAttributes {
  declare courseId: string
  declare title: string
  declare slug: string
  declare description?: string
  declare thumbnail?: string
  declare thumbnailPublicId?: string
  declare level: 'beginner' | 'intermediate' | 'advanced'
  declare isPaid: boolean
  declare price: number | null
  declare isPublished: boolean
  declare enrollmentCount: number
  declare createdBy: string
  declare readonly createdAt?: Date
  declare readonly updatedAt?: Date
}

Course.init(
  {
    courseId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      field: 'course_id' // map to database column
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    },
    thumbnail: {
      type: DataTypes.STRING(255)
    },
    thumbnailPublicId: {
      type: DataTypes.STRING(255),
      field: 'thumbnail_public_id' // map to database column
    },
    level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      defaultValue: 'beginner'
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_paid' // map to database column
    },
    price: {
      type: DataTypes.DECIMAL(10, 2)
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_published' // map to database column
    },
    enrollmentCount: {
      type: DataTypes.STRING,
      defaultValue: 0,
      field: 'enrollment_count' // map to database column
    },
    createdBy: {
      type: DataTypes.STRING,
      field: 'created_by', // map to database column
      references: {
        model: 'users',
        key: 'user_id'
      }
    }
  },
  {
    sequelize,
    tableName: 'courses',
    timestamps: true
  }
)

export default Course
