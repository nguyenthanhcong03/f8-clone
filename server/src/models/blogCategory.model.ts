import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

type BlogCategoryAttributes = {
  categoryId: string
  name: string
  slug: string
  description?: string
}

type BlogCategoryCreationAttributes = Optional<BlogCategoryAttributes, 'categoryId' | 'description'>

class BlogCategory
  extends Model<BlogCategoryAttributes, BlogCategoryCreationAttributes>
  implements BlogCategoryAttributes
{
  declare categoryId: string
  declare name: string
  declare slug: string
  declare description?: string
}

BlogCategory.init(
  {
    categoryId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'blog_categories',
    timestamps: true
  }
)

export default BlogCategory
