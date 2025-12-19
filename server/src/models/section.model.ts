import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface SectionAttributes {
  sectionId: string
  title: string
  courseId: string
  order?: number
}

type SectionCreationAttributes = Optional<SectionAttributes, 'sectionId' | 'order'>

class Section extends Model<SectionAttributes, SectionCreationAttributes> implements SectionAttributes {
  declare sectionId: string
  declare title: string
  declare courseId: string
  declare order?: number
}

Section.init(
  {
    sectionId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    courseId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'courseId'
      }
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'sections',
    timestamps: true
  }
)

export default Section
