import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'
export type BlogStatus = 'draft' | 'published'
type BlogAttributes = {
  blogId: string
  title: string
  slug: string
  content: string
  categoryId: string
  authorId: string
  thumbnail: string
  status: BlogStatus
  likes: number
  thumbnailPublicId: string
  publishedAt?: Date
}

type BlogCreationAttributes = Optional<
  BlogAttributes,
  'blogId' | 'thumbnail' | 'thumbnailPublicId' | 'likes' | 'publishedAt'
>

class Blog extends Model<BlogAttributes, BlogCreationAttributes> implements BlogAttributes {
  declare blogId: string
  declare title: string
  declare slug: string
  declare content: string
  declare categoryId: string
  declare authorId: string
  declare thumbnail: string
  declare status: BlogStatus
  declare likes: number
  declare thumbnailPublicId: string
  declare publishedAt?: Date
}

Blog.init(
  {
    blogId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'blog_categories',
        key: 'categoryId'
      }
    },
    authorId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
    },
    thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    thumbnailPublicId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      allowNull: false,
      defaultValue: 'draft'
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'blogs',
    timestamps: true
  }
)

export default Blog
