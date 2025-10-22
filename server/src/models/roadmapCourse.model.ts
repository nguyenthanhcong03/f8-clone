import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface RoadmapCourseAttributes {
  roadmap_course_id: string
  roadmap_id: string
  course_id: string
  order?: number
}

type RoadmapCourseCreationAttributes = Optional<RoadmapCourseAttributes, 'roadmap_course_id' | 'order'>

class RoadmapCourse
  extends Model<RoadmapCourseAttributes, RoadmapCourseCreationAttributes>
  implements RoadmapCourseAttributes
{
  public roadmap_course_id!: string
  public roadmap_id!: string
  public course_id!: string
  public order?: number
}

RoadmapCourse.init(
  {
    roadmap_course_id: { type: DataTypes.STRING, defaultValue: () => uuidv4(), primaryKey: true },

    roadmap_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'roadmaps',
        key: 'id'
      }
    },
    course_id: {
      type: DataTypes.STRING,
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
    tableName: 'roadmap_courses',
    timestamps: true
  }
)

export default RoadmapCourse
