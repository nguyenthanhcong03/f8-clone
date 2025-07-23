import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface LessonAttributes {
  id: number
  section_id: number
  title?: string
  video_url?: string
  content?: string
  order?: number
}

type LessonCreationAttributes = Optional<LessonAttributes, 'id' | 'title' | 'video_url' | 'content' | 'order'>

const Lesson = sequelize.define<Model<LessonAttributes, LessonCreationAttributes>>(
  'Lesson',
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
    content: {
      type: DataTypes.TEXT
    },
    order: {
      type: DataTypes.INTEGER
    }
  },
  {
    tableName: 'lessons',
    timestamps: false
  }
)

export default Lesson
