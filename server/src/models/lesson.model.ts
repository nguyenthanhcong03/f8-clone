import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface LessonAttributes {
  lesson_id: string
  course_id: string
  section_id: string
  title?: string
  video_url?: string
  video_public_id?: string
  duration?: number
  content?: string
  order?: number
}

type LessonCreationAttributes = Optional<
  LessonAttributes,
  'lesson_id' | 'title' | 'video_url' | 'video_public_id' | 'duration' | 'content' | 'order'
>

class Lesson extends Model<LessonAttributes, LessonCreationAttributes> implements LessonAttributes {
  declare lesson_id: string
  declare course_id: string
  declare section_id: string
  declare title?: string
  declare video_url?: string
  declare video_public_id?: string
  declare duration?: number
  declare content?: string
  declare order?: number
}

Lesson.init(
  {
    lesson_id: { type: DataTypes.STRING, defaultValue: () => uuidv4(), unique: true, primaryKey: true },
    course_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'course_id'
      }
    },
    section_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'sections',
        key: 'section_id'
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
