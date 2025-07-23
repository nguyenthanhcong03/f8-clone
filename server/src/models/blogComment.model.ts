import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface BlogCommentAttributes {
  id: number
  blog_id: number
  user_id: number
  content?: string
  created_at?: Date
}

type BlogCommentCreationAttributes = Optional<BlogCommentAttributes, 'id' | 'content' | 'created_at'>

const BlogComment = sequelize.define<Model<BlogCommentAttributes, BlogCommentCreationAttributes>>(
  'BlogComment',
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
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'blog_comments',
    timestamps: false
  }
)

export default BlogComment
