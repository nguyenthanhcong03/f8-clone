import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface EnrollmentAttributes {
  id: number
  user_id: number
  course_id: number
  enrolled_at?: Date
}

type EnrollmentCreationAttributes = Optional<EnrollmentAttributes, 'id' | 'enrolled_at'>

const Enrollment = sequelize.define<Model<EnrollmentAttributes, EnrollmentCreationAttributes>>(
  'Enrollment',
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
    tableName: 'enrollments',
    timestamps: false
  }
)

export default Enrollment
