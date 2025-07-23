import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface UserAttributes {
  id: number
  name: string
  email: string
  password: string
  avatar?: string
  role?: 'admin' | 'student'
  created_at?: Date
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'avatar' | 'role' | 'created_at'>

const User = sequelize.define<Model<UserAttributes, UserCreationAttributes>>(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING(255)
    },
    role: {
      type: DataTypes.ENUM('admin', 'student'),
      defaultValue: 'student'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'users',
    timestamps: false
  }
)

export default User
