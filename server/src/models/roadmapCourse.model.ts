import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface RoadmapCourseAttributes {
  id: number
  roadmap_id: number
  course_id: number
  order?: number
}

type RoadmapCourseCreationAttributes = Optional<RoadmapCourseAttributes, 'id' | 'order'>

class RoadmapCourse
  extends Model<RoadmapCourseAttributes, RoadmapCourseCreationAttributes>
  implements RoadmapCourseAttributes
{
  public id!: number
  public roadmap_id!: number
  public course_id!: number
  public order?: number
}

RoadmapCourse.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    roadmap_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roadmaps',
        key: 'id'
      }
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
    tableName: 'roadmap_courses',
    timestamps: true
  }
)

export default RoadmapCourse
