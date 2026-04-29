import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import ChatHistory from '../models/ChatHistory.js';
import Quiz from '../models/Quiz.js';
import * as geminiService from '../utils/geminiService.js';
import { findRelevantChunks } from '../utils/textChunker.js';




export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: 'Document ID is required'
      });
    }

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (document.status !== "ready") {
      return res.status(400).json({
        success: false,
        message: 'Document is still processing'
      });
    }

    const cards = await geminiService.generateFlashcardsFromText(
      document.extractedText,
      parseInt(count)
    );

    const formattedCards = cards.map(card => ({
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty || 'medium'
    }));

    
    const flashcardSet = await Flashcard.findOneAndUpdate(
      {
        userId: req.user._id,
        documentId: document._id
      },
      {
        userId: req.user._id,
        documentId: document._id,
        cards: formattedCards
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      success: true,
      data: flashcardSet
    });

  } catch (error) {
    next(error);
  }
};



export const generateQuiz = async (req, res, next) => {
  try {
    const { documentId, count = 5 } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: 'Document ID is required'
      });
    }

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const questions = await geminiService.generateQuiz(
      document.extractedText,
      parseInt(count)
    );

    if (!questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to generate quiz questions'
      });
    }

    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: `Quiz - ${document.title}`,
      questions,
      totalQuestions: questions.length, 
      score: 0,
      userAnswers: []
    });

    res.status(200).json({
      success: true,
      data: quiz
    });

  } catch (error) {
    next(error);
  }
};


export const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const summary = await geminiService.generateSummary(
      document.extractedText
    );

    res.status(200).json({
      success: true,
      data: summary
    });

  } catch (error) {
    next(error);
  }
};



export const chat = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;

   
    if (!documentId || !question) {
      return res.status(400).json({
        success: false,
        message: "Document ID and question are required",
      });
    }

    const document = await Document.findById(documentId).populate("chunks");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

   
    const relevantChunks = findRelevantChunks(
      document.chunks || [],
      question,
      3
    );

  
    const answer = await geminiService.chat(question, relevantChunks.map((chunk) => chunk.content));

   
    let chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId,
    });

    
    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId: req.user._id,
        documentId,
        messages: [],
      });
    }

   
    chatHistory.messages.push(
      {
        role: "user",
        content: question,
        relevantChunks: [],
      },
      {
        role: "assistant",
        content: answer,
        relevantChunks: relevantChunks.map(
          (chunk) => chunk.chunkIndex
        ),
      }
    );

    await chatHistory.save();

    
    const simplifiedChunks = relevantChunks.map((chunk) => ({
      chunkIndex: chunk.chunkIndex,
      chunkId: chunk._id,
    }));

    
    res.status(200).json({
      success: true,
      data: {
        answer,
        relevantChunks: simplifiedChunks,
        chatHistoryId: chatHistory._id,
      },
    });
  } catch (error) {
    console.error("Chat Controller Error:", error);
    next(error);
  }
}




export const explainConcept = async (req, res, next) => {
  try {
    const { documentId, concept } = req.body;

    const document = await Document.findById(documentId)
      .populate("chunks");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    const relevantChunks = findRelevantChunks(
      document.chunks || [],
      concept,
      3
    );

    const explanation = await geminiService.explainConcept(
      concept,
      relevantChunks.map(chunk => chunk.content)
    );

    const simplifiedChunks = relevantChunks.map(chunk => ({
      chunkIndex: chunk.chunkIndex,
      chunkId: chunk._id
    }));

    res.status(200).json({
      success: true,
      data: {
        answer: explanation,
        relevantChunks: simplifiedChunks
      }
    });

  } catch (error) {
    next(error);
  }
};



export const getChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const history = await ChatHistory.find({
      userId: req.user._id,
      documentId: documentId
    }).sort({ createdAt: 1 });

    res.status(200).json(history);

  } catch (error) {
    next(error);
  }
};
