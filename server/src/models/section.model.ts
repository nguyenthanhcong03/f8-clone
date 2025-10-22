import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface SectionAttributes {
  section_id: string
  title: string
  course_id: string
  order?: number
}

type SectionCreationAttributes = Optional<SectionAttributes, 'section_id' | 'order'>

class Section extends Model<SectionAttributes, SectionCreationAttributes> implements SectionAttributes {
  declare section_id: string
  declare title: string
  declare course_id: string
  declare order?: number
}

Section.init(
  {
    section_id: { type: DataTypes.STRING, defaultValue: () => uuidv4(), primaryKey: true },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    course_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'course_id'
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
