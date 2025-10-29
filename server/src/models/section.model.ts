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
      primaryKey: true,
      field: 'section_id'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    courseId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'course_id',
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
