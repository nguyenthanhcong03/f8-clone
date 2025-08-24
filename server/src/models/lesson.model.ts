import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface LessonAttributes {
  id: number
  section_id: number
  title?: string
  video_url?: string
  video_public_id?: string
  duration?: number
  content?: string
  order?: number
}

type LessonCreationAttributes = Optional<
  LessonAttributes,
  'id' | 'title' | 'video_url' | 'video_public_id' | 'duration' | 'content' | 'order'
>

class Lesson extends Model<LessonAttributes, LessonCreationAttributes> implements LessonAttributes {
  declare id: number
  declare section_id: number
  declare title?: string
  declare video_url?: string
  declare video_public_id?: string
  declare duration?: number
  declare content?: string
  declare order?: number
}

Lesson.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sections',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255)
    },
    video_url: {
      type: DataTypes.STRING(255)
    },
    video_public_id: {
      type: DataTypes.STRING(255)
    },
    duration: {
      type: DataTypes.INTEGER
    },
    content: {
      type: DataTypes.TEXT
    },
    order: {
      type: DataTypes.INTEGER
    }
  },
  {
    sequelize,
    tableName: 'lessons',
    timestamps: true
  }
)

export default Lesson
