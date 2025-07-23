import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface BlogAttributes {
  id: number
  title?: string
  slug?: string
  content?: string
  author_id?: number
  thumbnail?: string
  created_at?: Date
}

type BlogCreationAttributes = Optional<
  BlogAttributes,
  'id' | 'title' | 'slug' | 'content' | 'author_id' | 'thumbnail' | 'created_at'
>

const Blog = sequelize.define<Model<BlogAttributes, BlogCreationAttributes>>(
  'Blog',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255)
    },
    slug: {
      type: DataTypes.STRING(255)
    },
    content: {
      type: DataTypes.TEXT
    },
    author_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    thumbnail: {
      type: DataTypes.STRING(255)
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'blogs',
    timestamps: false
  }
)

export default Blog
