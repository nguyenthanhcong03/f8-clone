import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

// định nghĩa attributes
interface ProgressAttributes {
  progress_id: string
  user_id: string
  lesson_id: string
  is_completed: boolean
}

// tạo type cho create
type ProgressCreationAttributes = Optional<ProgressAttributes, 'progress_id' | 'is_completed'>

class Progress extends Model<ProgressAttributes, ProgressCreationAttributes> implements ProgressAttributes {
  public progress_id!: string
  public user_id!: string
  public lesson_id!: string
  public is_completed!: boolean
}

Progress.init(
  {
    progress_id: { type: DataTypes.STRING, defaultValue: () => uuidv4(), unique: true, primaryKey: true },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lesson_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_completed: {
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
