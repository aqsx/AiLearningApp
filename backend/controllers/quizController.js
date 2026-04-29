import Quiz from "../models/Quiz.js";



export const getQuizByDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const quizzes = await Quiz.find({
      documentId,
      userId: req.user._id
    }).select("-questions.correctAnswer");

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No quizzes found for this document"
      });
    }

    res.status(200).json({
      success: true,
      data: quizzes
    });

  } catch (error) {
    next(error);
  }
};



export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id, // ✅ FIXED
      userId: req.user._id
    }).select("-questions.correctAnswer");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    res.status(200).json({
      success: true,
      data: quiz // ✅ single object
    });

  } catch (error) {
    next(error);
  }
};



export const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Invalid answers format"
      });
    }

    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    let score = 0;
    const userAnswers = [];

    answers.forEach(({ questionIndex, selectedAnswer }) => {
      const question = quiz.questions[questionIndex];
      if (!question) return;

      const isCorrect = question.correctAnswer === selectedAnswer;
      if (isCorrect) score++;

      userAnswers.push({
        questionIndex,
        selectedAnswer,
        isCorrect
      });
    });

    quiz.userAnswers = userAnswers;
    quiz.score = score;
    quiz.completedAt = new Date();

    await quiz.save();

    res.status(200).json({
      success: true,
      data: {
        score,
        totalQuestions: quiz.totalQuestions
      }
    });

  } catch (error) {
    next(error);
  }
};



export const getQuizResults = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        score: quiz.score,
        totalQuestions: quiz.totalQuestions,
        userAnswers: quiz.userAnswers,
        questions: quiz.questions
      }
    });
  } catch (error) {
    next(error);
  }
};



export const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

