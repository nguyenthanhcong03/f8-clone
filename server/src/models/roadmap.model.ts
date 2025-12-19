import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

type RoadmapAttributes = {
  roadmapId: string
  title: string
  description?: string
  image?: string
  imagePublicId?: string
}

type RoadmapCreationAttributes = Optional<RoadmapAttributes, 'roadmapId' | 'description' | 'image' | 'imagePublicId'>

class Roadmap extends Model<RoadmapAttributes, RoadmapCreationAttributes> implements RoadmapAttributes {
  declare roadmapId: string
  declare title: string
  declare description?: string
  declare image?: string
  declare imagePublicId?: string
}

Roadmap.init(
  {
    roadmapId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    imagePublicId: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'roadmaps',
    timestamps: true
  }
)

export default Roadmap
