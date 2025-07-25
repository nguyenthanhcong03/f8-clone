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

class Quiz extends Model<QuizAttributes, QuizCreationAttributes> implements QuizAttributes {
  public id!: number
  public lesson_id!: number
  public question?: string
  public options?: string[]
  public correct_option?: string
}

Quiz.init(
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
    sequelize,
    tableName: 'quizzes',
    timestamps: true
  }
)

export default Quiz
