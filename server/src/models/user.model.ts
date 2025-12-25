import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface UserAttributes {
  userId: string
  fullName: string
  username: string
  phone?: string
  email: string
  password: string
  avatar?: string
  avatarPublicId?: string
  role?: 'admin' | 'student'
}

type UserCreationAttributes = Optional<UserAttributes, 'userId' | 'phone' | 'avatar' | 'avatarPublicId' | 'role'>

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare userId: string
  declare fullName: string
  declare username: string
  declare phone?: string
  declare email: string
  declare password: string
  declare avatar?: string
  declare avatarPublicId?: string
  declare role?: 'admin' | 'student'
}

User.init(
  {
    userId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
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
      type: DataTypes.STRING(255),
      allowNull: true
    },
    avatarPublicId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'student'),
      allowNull: false,
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
