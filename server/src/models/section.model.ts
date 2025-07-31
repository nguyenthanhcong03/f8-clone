import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface SectionAttributes {
  id: number
  title: string
  course_id: number
  order?: number
}

type SectionCreationAttributes = Optional<SectionAttributes, 'id' | 'order'>

class Section extends Model<SectionAttributes, SectionCreationAttributes> implements SectionAttributes {
  declare id: number
  declare title: string
  declare course_id: number
  declare order?: number
}

Section.init(
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
    sequelize,
    tableName: 'sections',
    timestamps: true
  }
)

export default Section
