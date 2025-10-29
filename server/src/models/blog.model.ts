import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface BlogAttributes {
  blogId: string
  title?: string
  slug?: string
  content?: string
  authorId?: string
  thumbnail?: string
  thumbnailPublicId?: string
}

type BlogCreationAttributes = Optional<
  BlogAttributes,
  'blogId' | 'title' | 'slug' | 'content' | 'authorId' | 'thumbnail' | 'thumbnailPublicId'
>

class Blog extends Model<BlogAttributes, BlogCreationAttributes> implements BlogAttributes {
  public blogId!: string
  public title?: string
  public slug?: string
  public content?: string
  public authorId?: string
  public thumbnail?: string
  public thumbnailPublicId?: string
}

Blog.init(
  {
    blogId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      field: 'blog_id'
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
    authorId: {
      type: DataTypes.STRING,
      field: 'author_id',
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    thumbnail: {
      type: DataTypes.STRING(255)
    },
    thumbnailPublicId: {
      type: DataTypes.STRING(255),
      field: 'thumbnail_public_id'
    }
  },
  {
    sequelize,
    tableName: 'blogs',
    timestamps: true
  }
)

export default Blog
