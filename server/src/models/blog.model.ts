import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface BlogAttributes {
  blog_id: string
  title?: string
  slug?: string
  content?: string
  author_id?: string
  thumbnail?: string
  thumbnail_public_id?: string
}

type BlogCreationAttributes = Optional<
  BlogAttributes,
  'blog_id' | 'title' | 'slug' | 'content' | 'author_id' | 'thumbnail' | 'thumbnail_public_id'
>

class Blog extends Model<BlogAttributes, BlogCreationAttributes> implements BlogAttributes {
  public blog_id!: string
  public title?: string
  public slug?: string
  public content?: string
  public author_id?: string
  public thumbnail?: string
  public thumbnail_public_id?: string
}

Blog.init(
  {
    blog_id: { type: DataTypes.STRING, defaultValue: () => uuidv4(), unique: true, primaryKey: true },
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
      type: DataTypes.STRING,
      references: {
        model: 'users',
        key: 'user_id'
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
