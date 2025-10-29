import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface RoadmapAttributes {
  roadmapId: string
  title?: string
  description?: string
  image?: string
  imagePublicId?: string
}

type RoadmapCreationAttributes = Optional<
  RoadmapAttributes,
  'roadmapId' | 'title' | 'description' | 'image' | 'imagePublicId'
>

class Roadmap extends Model<RoadmapAttributes, RoadmapCreationAttributes> implements RoadmapAttributes {
  public roadmapId!: string
  public title?: string
  public description?: string
  public image?: string
  public imagePublicId?: string
}

Roadmap.init(
  {
    roadmapId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      field: 'roadmap_id'
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
    imagePublicId: {
      type: DataTypes.STRING(255),
      field: 'image_public_id'
    }
  },
  {
    sequelize,
    tableName: 'roadmaps',
    timestamps: true
  }
)

export default Roadmap
