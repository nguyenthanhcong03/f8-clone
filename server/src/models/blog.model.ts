import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface BlogAttributes {
  id: number
  title?: string
  slug?: string
  content?: string
  author_id?: number
  thumbnail?: string
  thumbnail_public_id?: string
}

type BlogCreationAttributes = Optional<
  BlogAttributes,
  'id' | 'title' | 'slug' | 'content' | 'author_id' | 'thumbnail' | 'thumbnail_public_id'
>

class Blog extends Model<BlogAttributes, BlogCreationAttributes> implements BlogAttributes {
  public id!: number
  public title?: string
  public slug?: string
  public content?: string
  public author_id?: number
  public thumbnail?: string
  public thumbnail_public_id?: string
}

Blog.init(
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
    thumbnail_public_id: {
      type: DataTypes.STRING(255)
    }
  },
  {
    sequelize,
    tableName: 'blogs',
    timestamps: true
  }
)

export default Blog
