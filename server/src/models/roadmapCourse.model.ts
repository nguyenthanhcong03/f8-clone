import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface RoadmapCourseAttributes {
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
  public roadmapCourseId!: string
  public roadmapId!: string
  public courseId!: string
  public order?: number
}

RoadmapCourse.init(
  {
    roadmapCourseId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      field: 'roadmap_course_id'
    },
    roadmapId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'roadmap_id',
      references: {
        model: 'roadmaps',
        key: 'roadmap_id'
      }
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
    tableName: 'roadmap_courses',
    timestamps: true
  }
)

export default RoadmapCourse
