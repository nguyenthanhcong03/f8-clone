import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface CourseAttributes {
  id: number
  title: string
  slug: string
  description?: string
  thumbnail?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  is_paid?: boolean
  price?: number
  created_by?: number
  created_at?: Date
}

type CourseCreationAttributes = Optional<
  CourseAttributes,
  'id' | 'description' | 'thumbnail' | 'level' | 'is_paid' | 'price' | 'created_by' | 'created_at'
>

const Course = sequelize.define<Model<CourseAttributes, CourseCreationAttributes>>(
  'Course',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
      type: DataTypes.TEXT
    },
    thumbnail: {
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
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'courses',
    timestamps: false
  }
)

export default Course
