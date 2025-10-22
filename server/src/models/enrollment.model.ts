import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface EnrollmentAttributes {
  enrollment_id: string
  user_id: string
  course_id: string
  enrolled_at?: Date
}

type EnrollmentCreationAttributes = Optional<EnrollmentAttributes, 'enrollment_id' | 'enrolled_at'>

class Enrollment extends Model<EnrollmentAttributes, EnrollmentCreationAttributes> implements EnrollmentAttributes {
  declare enrollment_id: string
  declare user_id: string
  declare course_id: string
  declare enrolled_at?: Date
}

Enrollment.init(
  {
    enrollment_id: { type: DataTypes.STRING, defaultValue: () => uuidv4(), primaryKey: true },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    course_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'course_id'
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
