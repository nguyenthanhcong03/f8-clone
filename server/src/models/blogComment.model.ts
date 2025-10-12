import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface BlogCommentAttributes {
  blog_comment_id: string
  blog_id: string
  user_id: string
  content?: string
}

type BlogCommentCreationAttributes = Optional<BlogCommentAttributes, 'blog_comment_id' | 'content'>

class BlogComment extends Model<BlogCommentAttributes, BlogCommentCreationAttributes> implements BlogCommentAttributes {
  public blog_comment_id!: string
  public blog_id!: string
  public user_id!: string
  public content?: string
}

BlogComment.init(
  {
    blog_comment_id: { type: DataTypes.STRING, defaultValue: () => uuidv4(), unique: true, primaryKey: true },
    blog_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'blogs',
        key: 'blog_id'
      }
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
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
