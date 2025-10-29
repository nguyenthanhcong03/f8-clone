import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface LessonAttributes {
  lessonId: string
  courseId: string
  sectionId: string
  title?: string
  videoUrl?: string
  videoPublicId?: string
  duration?: number
  content?: string
  order?: number
}

type LessonCreationAttributes = Optional<
  LessonAttributes,
  'lessonId' | 'title' | 'videoUrl' | 'videoPublicId' | 'duration' | 'content' | 'order'
>

class Lesson extends Model<LessonAttributes, LessonCreationAttributes> implements LessonAttributes {
  declare lessonId: string
  declare courseId: string
  declare sectionId: string
  declare title?: string
  declare videoUrl?: string
  declare videoPublicId?: string
  declare duration?: number
  declare content?: string
  declare order?: number
}

Lesson.init(
  {
    lessonId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      field: 'lesson_id'
    },
    courseId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'course_id',
      references: {
        model: 'courses',
        key: 'course_id'
      }
    },
    sectionId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'section_id',
      references: {
        model: 'sections',
        key: 'section_id'
      }
    },
    title: {
      type: DataTypes.STRING(255)
    },
    videoUrl: {
      type: DataTypes.STRING(255),
      field: 'video_url'
    },
    videoPublicId: {
      type: DataTypes.STRING(255),
      field: 'video_public_id'
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
