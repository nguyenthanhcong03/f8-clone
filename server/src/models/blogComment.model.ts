import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

type BlogCommentAttributes = {
  blogCommentId: string
  blogId: string
  userId: string
  content: string
}

type BlogCommentCreationAttributes = Optional<BlogCommentAttributes, 'blogCommentId'>

class BlogComment extends Model<BlogCommentAttributes, BlogCommentCreationAttributes> implements BlogCommentAttributes {
  declare blogCommentId: string
  declare blogId: string
  declare userId: string
  declare content: string
}

BlogComment.init(
  {
    blogCommentId: {
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
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'blog_comments',
    timestamps: true
  }
)

export default BlogComment
