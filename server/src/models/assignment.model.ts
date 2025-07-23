import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface AssignmentAttributes {
  id: number
  lesson_id: number
  title?: string
  description?: string
  file_url?: string
  due_date?: Date
}

type AssignmentCreationAttributes = Optional<
  AssignmentAttributes,
  'id' | 'title' | 'description' | 'file_url' | 'due_date'
>

const Assignment = sequelize.define<Model<AssignmentAttributes, AssignmentCreationAttributes>>(
  'Assignment',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    lesson_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lessons',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255)
    },
    description: {
      type: DataTypes.TEXT
    },
    file_url: {
      type: DataTypes.STRING(255)
    },
    due_date: {
      type: DataTypes.DATE
    }
  },
  {
    tableName: 'assignments',
    timestamps: false
  }
)

export default Assignment
