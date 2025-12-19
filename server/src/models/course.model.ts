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
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    thumbnailPublicId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      allowNull: false,
      defaultValue: 'beginner'
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    enrollmentCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
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
