import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface QuizAttributes {
  quiz_id: string
  lesson_id: string
  question?: string
  options?: string[]
  correct_option?: string
}

type QuizCreationAttributes = Optional<QuizAttributes, 'quiz_id' | 'question' | 'options' | 'correct_option'>

class Quiz extends Model<QuizAttributes, QuizCreationAttributes> implements QuizAttributes {
  public quiz_id!: string
  public lesson_id!: string
  public question?: string
  public options?: string[]
  public correct_option?: string
}

Quiz.init(
  {
    quiz_id: { type: DataTypes.STRING, defaultValue: () => uuidv4(), primaryKey: true },
    lesson_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'lessons',
        key: 'lesson_id'
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
