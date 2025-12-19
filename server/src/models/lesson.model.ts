import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

type LessonAttributes = {
  lessonId: string
  sectionId: string
  title: string
  videoUrl: string
  videoPublicId: string
  duration?: number
  content?: string
  order?: number
}

type LessonCreationAttributes = Optional<LessonAttributes, 'lessonId' | 'duration' | 'content' | 'order'>

class Lesson extends Model<LessonAttributes, LessonCreationAttributes> implements LessonAttributes {
  declare lessonId: string
  declare sectionId: string
  declare title: string
  declare videoUrl: string
  declare videoPublicId: string
  declare duration?: number
  declare content?: string
  declare order?: number
}

Lesson.init(
  {
    lessonId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    sectionId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'sections',
        key: 'sectionId'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    videoUrl: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    videoPublicId: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'lessons',
    timestamps: true
  }
)

export default Lesson
