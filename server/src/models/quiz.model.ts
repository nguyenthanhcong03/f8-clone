import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface QuizAttributes {
  id: number
  lesson_id: number
  question?: string
  options?: string[]
  correct_option?: string
}

type QuizCreationAttributes = Optional<QuizAttributes, 'id' | 'question' | 'options' | 'correct_option'>

const Quiz = sequelize.define<Model<QuizAttributes, QuizCreationAttributes>>(
  'Quiz',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    lesson_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lessons',
        key: 'id'
      }
    },
    question: {
      type: DataTypes.TEXT
    },
    options: {
      type: DataTypes.JSON
    },
    correct_option: {
      type: DataTypes.STRING(10)
    }
  },
  {
    tableName: 'quizzes',
    timestamps: false
  }
)

export default Quiz
