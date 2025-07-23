import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface RoadmapAttributes {
  id: number
  title?: string
  description?: string
  image?: string
}

type RoadmapCreationAttributes = Optional<RoadmapAttributes, 'id' | 'title' | 'description' | 'image'>

const Roadmap = sequelize.define<Model<RoadmapAttributes, RoadmapCreationAttributes>>(
  'Roadmap',
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
    }
  },
  {
    tableName: 'roadmaps',
    timestamps: false
  }
)

export default Roadmap
