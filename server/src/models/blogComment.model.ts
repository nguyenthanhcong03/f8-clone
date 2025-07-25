import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface BlogCommentAttributes {
  id: number
  blog_id: number
  user_id: number
  content?: string
}

type BlogCommentCreationAttributes = Optional<BlogCommentAttributes, 'id' | 'content'>

class BlogComment extends Model<BlogCommentAttributes, BlogCommentCreationAttributes> implements BlogCommentAttributes {
  public id!: number
  public blog_id!: number
  public user_id!: number
  public content?: string
}

BlogComment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    blog_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'blogs',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
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
