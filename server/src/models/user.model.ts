import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface UserAttributes {
  user_id: string
  name: string
  phone?: string
  email: string
  password: string
  avatar?: string
  avatar_public_id?: string
  role?: 'admin' | 'student'
}

type UserCreationAttributes = Optional<UserAttributes, 'user_id' | 'phone' | 'avatar' | 'avatar_public_id' | 'role'>

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare user_id: string
  declare name: string
  declare phone?: string
  declare email: string
  declare password: string
  declare avatar?: string
  declare avatar_public_id?: string
  declare role?: 'admin' | 'student'
}

User.init(
  {
    user_id: { type: DataTypes.STRING, defaultValue: () => uuidv4(), unique: true, primaryKey: true },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true
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
    avatar_public_id: {
      type: DataTypes.STRING(255)
    },
    role: {
      type: DataTypes.ENUM('admin', 'student'),
      defaultValue: 'student'
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true
  }
)

export default User
