import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface CourseAttributes {
  id: number
  title: string
  slug: string
  description?: string
  thumbnail?: string
  thumbnail_public_id?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  is_paid?: boolean
  price?: number
  created_by?: number
}

type CourseCreationAttributes = Optional<
  CourseAttributes,
  'id' | 'description' | 'thumbnail' | 'thumbnail_public_id' | 'level' | 'is_paid' | 'price' | 'created_by'
>

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  public id!: number
  public title!: string
  public slug!: string
  public description?: string
  public thumbnail?: string
  public thumbnail_public_id?: string
  public level?: 'beginner' | 'intermediate' | 'advanced'
  public is_paid?: boolean
  public price?: number
  public created_by?: number
}

Course.init(
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
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
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
