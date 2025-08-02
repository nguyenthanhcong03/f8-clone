import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface EnrollmentAttributes {
  id: number
  user_id: number
  course_id: number
  enrolled_at?: Date
}

type EnrollmentCreationAttributes = Optional<EnrollmentAttributes, 'id' | 'enrolled_at'>

class Enrollment extends Model<EnrollmentAttributes, EnrollmentCreationAttributes> implements EnrollmentAttributes {
  declare id: number
  declare user_id: number
  declare course_id: number
  declare enrolled_at?: Date
}

Enrollment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    enrolled_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'enrollments',
    timestamps: true
  }
)

export default Enrollment
