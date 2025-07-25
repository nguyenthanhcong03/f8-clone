import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface RoadmapAttributes {
  id: number
  title?: string
  description?: string
  image?: string
  image_public_id?: string
}

type RoadmapCreationAttributes = Optional<
  RoadmapAttributes,
  'id' | 'title' | 'description' | 'image' | 'image_public_id'
>

class Roadmap extends Model<RoadmapAttributes, RoadmapCreationAttributes> implements RoadmapAttributes {
  public id!: number
  public title?: string
  public description?: string
  public image?: string
  public image_public_id?: string
}

Roadmap.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255)
    },
    description: {
      type: DataTypes.TEXT
    },
    image: {
      type: DataTypes.STRING(255)
    },
    image_public_id: {
      type: DataTypes.STRING(255)
    }
  },
  {
    sequelize,
    tableName: 'roadmaps',
    timestamps: true
  }
)

export default Roadmap
