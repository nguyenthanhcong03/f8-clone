import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface EnrollmentAttributes {
  enrollmentId: string
  userId: string
  courseId: string
  enrolledAt?: Date
}

type EnrollmentCreationAttributes = Optional<EnrollmentAttributes, 'enrollmentId' | 'enrolledAt'>

class Enrollment extends Model<EnrollmentAttributes, EnrollmentCreationAttributes> implements EnrollmentAttributes {
  declare enrollmentId: string
  declare userId: string
  declare courseId: string
  declare enrolledAt?: Date
}

Enrollment.init(
  {
    enrollmentId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      field: 'enrollment_id'
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    courseId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'course_id',
      references: {
        model: 'courses',
        key: 'course_id'
      }
    },
    enrolledAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'enrolled_at'
    }
  },
  {
    sequelize,
    tableName: 'enrollments',
    timestamps: true
  }
)

export default Enrollment
