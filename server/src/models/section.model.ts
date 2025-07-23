import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface SectionAttributes {
  id: number
  title: string
  course_id: number
  order?: number
}

type SectionCreationAttributes = Optional<SectionAttributes, 'id' | 'order'>

const Section = sequelize.define<Model<SectionAttributes, SectionCreationAttributes>>(
  'Section',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    order: {
      type: DataTypes.INTEGER
    }
  },
  {
    tableName: 'sections',
    timestamps: false
  }
)

export default Section
