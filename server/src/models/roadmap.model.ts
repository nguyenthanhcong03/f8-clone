import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface RoadmapAttributes {
  roadmap_id: string
  title?: string
  description?: string
  image?: string
  image_public_id?: string
}

type RoadmapCreationAttributes = Optional<
  RoadmapAttributes,
  'roadmap_id' | 'title' | 'description' | 'image' | 'image_public_id'
>

class Roadmap extends Model<RoadmapAttributes, RoadmapCreationAttributes> implements RoadmapAttributes {
  public roadmap_id!: string
  public title?: string
  public description?: string
  public image?: string
  public image_public_id?: string
}

Roadmap.init(
  {
    roadmap_id: { type: DataTypes.STRING, defaultValue: () => uuidv4(), unique: true, primaryKey: true },

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
