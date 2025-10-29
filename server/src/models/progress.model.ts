import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

// định nghĩa attributes
interface ProgressAttributes {
  progressId: string
  userId: string
  lessonId: string
  isCompleted: boolean
}

// tạo type cho create
type ProgressCreationAttributes = Optional<ProgressAttributes, 'progressId' | 'isCompleted'>

class Progress extends Model<ProgressAttributes, ProgressCreationAttributes> implements ProgressAttributes {
  public progressId!: string
  public userId!: string
  public lessonId!: string
  public isCompleted!: boolean
}

Progress.init(
  {
    progressId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      field: 'progress_id'
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'user_id'
    },
    lessonId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'lesson_id'
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_completed'
    }
  },
  {
    sequelize,
    tableName: 'progress',
    timestamps: true
  }
)

export default Progress
