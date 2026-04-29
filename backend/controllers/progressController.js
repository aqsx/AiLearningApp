import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    
    const documentCount = await Document.countDocuments({ userId });
    const flashcardCount = await Flashcard.countDocuments({ userId });
    const quizCount = await Quiz.countDocuments({ userId });
    const completedQuizzes = await Quiz.countDocuments({
      userId,
      score: { $gt: 0 }
    });

   
    const recentDocuments = await Document.find({ userId })
      .sort({ updatedAt: -1 }) 
      .limit(5)
      .select("title updatedAt")
      .lean();

    
    const flashcardSets = await Flashcard.find({ userId })
      .select("title cards updatedAt") 
      .lean();

    const formattedFlashcardSets = flashcardSets.map(set => ({
      _id: set._id,
      title: set.title,
      totalCards: set.cards?.length || 0,
      updatedAt: set.updatedAt 
    }));

    
    const completionRate =
      quizCount === 0
        ? 0
        : Math.round((completedQuizzes / quizCount) * 100);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalDocuments: documentCount,
          totalFlashcards: flashcardCount,
          totalQuizzes: quizCount,
          completedQuizzes,
          completionRate: `${completionRate}%`
        },
        recentDocuments: recentDocuments, 
        flashcardSets: formattedFlashcardSets
      }
    });

  } catch (error) {
    next(error);
  }
};