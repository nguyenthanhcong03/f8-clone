import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

interface QuizAttributes {
  quizId: string
  lessonId: string
  question?: string
  options?: string[]
  correctOption?: string
}

type QuizCreationAttributes = Optional<QuizAttributes, 'quizId' | 'question' | 'options' | 'correctOption'>

class Quiz extends Model<QuizAttributes, QuizCreationAttributes> implements QuizAttributes {
  public quizId!: string
  public lessonId!: string
  public question?: string
  public options?: string[]
  public correctOption?: string
}

Quiz.init(
  {
    quizId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      field: 'quiz_id'
    },
    lessonId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'lesson_id',
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
    correctOption: {
      type: DataTypes.STRING(10),
      field: 'correct_option'
    }
  },
  {
    sequelize,
    tableName: 'quizzes',
    timestamps: true
  }
)

export default Quiz
