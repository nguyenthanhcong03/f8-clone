import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { v4 as uuidv4 } from 'uuid'

type QuizAttributes = {
  quizId: string
  lessonId: string
  question: string
  options: string[]
  correctOption: string
}

type QuizCreationAttributes = Optional<QuizAttributes, 'quizId'>

class Quiz extends Model<QuizAttributes, QuizCreationAttributes> implements QuizAttributes {
  declare quizId: string
  declare lessonId: string
  declare question: string
  declare options: string[]
  declare correctOption: string
}

Quiz.init(
  {
    quizId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    lessonId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'lessons',
        key: 'lessonId'
      }
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false
    },
    correctOption: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'quizzes',
    timestamps: true
  }
)

export default Quiz
