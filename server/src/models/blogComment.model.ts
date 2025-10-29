import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface BlogCommentAttributes {
  blogCommentId: string
  blogId: string
  userId: string
  content?: string
}

type BlogCommentCreationAttributes = Optional<BlogCommentAttributes, 'blogCommentId' | 'content'>

class BlogComment extends Model<BlogCommentAttributes, BlogCommentCreationAttributes> implements BlogCommentAttributes {
  public blogCommentId!: string
  public blogId!: string
  public userId!: string
  public content?: string
}

BlogComment.init(
  {
    blogCommentId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      field: 'blog_comment_id'
    },
    blogId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'blog_id',
      references: {
        model: 'blogs',
        key: 'blog_id'
      }
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
    content: {
      type: DataTypes.TEXT
    }
  },
  {
    sequelize,
    tableName: 'blog_comments',
    timestamps: true
  }
)

export default BlogComment
