import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface RoadmapCourseAttributes {
  id: number
  roadmap_id: number
  course_id: number
  order?: number
}

type RoadmapCourseCreationAttributes = Optional<RoadmapCourseAttributes, 'id' | 'order'>

const RoadmapCourse = sequelize.define<Model<RoadmapCourseAttributes, RoadmapCourseCreationAttributes>>(
  'RoadmapCourse',
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
    tableName: 'roadmap_courses',
    timestamps: false
  }
)

export default RoadmapCourse
