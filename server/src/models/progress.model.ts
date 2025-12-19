import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

// định nghĩa attributes
type ProgressAttributes = {
  progressId: string
  userId: string
  lessonId: string
  isCompleted: boolean
}

// tạo type cho create
type ProgressCreationAttributes = Optional<ProgressAttributes, 'progressId' | 'isCompleted'>

class Progress extends Model<ProgressAttributes, ProgressCreationAttributes> implements ProgressAttributes {
  declare progressId: string
  declare userId: string
  declare lessonId: string
  declare isCompleted: boolean
}

Progress.init(
  {
    progressId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lessonId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'progress',
    timestamps: true
  }
)

export default Progress
