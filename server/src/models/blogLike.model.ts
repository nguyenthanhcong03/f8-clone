import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface BlogLikeAttributes {
  likeId: string
  blogId: string
  userId: string
}

type BlogLikeCreationAttributes = Optional<BlogLikeAttributes, 'likeId'>

class BlogLike extends Model<BlogLikeAttributes, BlogLikeCreationAttributes> implements BlogLikeAttributes {
  declare likeId: string
  declare blogId: string
  declare userId: string
}

BlogLike.init(
  {
    likeId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    blogId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'blogs',
        key: 'blogId'
      }
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
    }
  },
  {
    sequelize,
    tableName: 'blog_likes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['blogId', 'userId']
      }
    ]
  }
)

export default BlogLike
