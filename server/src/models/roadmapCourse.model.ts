import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

type RoadmapCourseAttributes = {
  roadmapCourseId: string
  roadmapId: string
  courseId: string
  order?: number
}

type RoadmapCourseCreationAttributes = Optional<RoadmapCourseAttributes, 'roadmapCourseId' | 'order'>

class RoadmapCourse
  extends Model<RoadmapCourseAttributes, RoadmapCourseCreationAttributes>
  implements RoadmapCourseAttributes
{
  declare roadmapCourseId: string
  declare roadmapId: string
  declare courseId: string
  declare order?: number
}

RoadmapCourse.init(
  {
    roadmapCourseId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    roadmapId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'roadmaps',
        key: 'roadmapId'
      }
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
    tableName: 'roadmap_courses',
    timestamps: true
  }
)

export default RoadmapCourse
