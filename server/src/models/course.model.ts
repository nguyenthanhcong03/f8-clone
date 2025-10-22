import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface CourseAttributes {
  course_id: string
  title: string
  slug: string
  description?: string
  thumbnail?: string
  thumbnail_public_id?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  is_paid?: boolean
  price?: number
  enrollment_count?: number
  created_by?: string
}

type CourseCreationAttributes = Optional<
  CourseAttributes,
  | 'course_id'
  | 'description'
  | 'thumbnail'
  | 'thumbnail_public_id'
  | 'level'
  | 'is_paid'
  | 'price'
  | 'enrollment_count'
  | 'created_by'
>

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  declare course_id: string
  declare title: string
  declare slug: string
  declare description?: string
  declare thumbnail?: string
  declare thumbnail_public_id?: string
  declare level?: 'beginner' | 'intermediate' | 'advanced'
  declare is_paid?: boolean
  declare price?: number
  declare enrollment_count?: number
  declare created_by?: string
}

Course.init(
  {
    course_id: { type: DataTypes.STRING, defaultValue: () => uuidv4(), primaryKey: true },
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
    thumbnail_public_id: {
      type: DataTypes.STRING(255)
    },
    level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      defaultValue: 'beginner'
    },
    is_paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2)
    },
    enrollment_count: {
      type: DataTypes.STRING,
      defaultValue: 0
    },
    created_by: {
      type: DataTypes.STRING,
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
