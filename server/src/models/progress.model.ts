import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

// định nghĩa attributes
interface ProgressAttributes {
  id: number
  user_id: number
  lesson_id: number
  is_completed: boolean
}

// tạo type cho create
type ProgressCreationAttributes = Optional<ProgressAttributes, 'id' | 'is_completed'>

class Progress extends Model<ProgressAttributes, ProgressCreationAttributes> implements ProgressAttributes {
  public id!: number
  public user_id!: number
  public lesson_id!: number
  public is_completed!: boolean
}

Progress.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    lesson_id: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    modelName: 'Progress',
    timestamps: true
  }
)

export default Progress
