import Flashcard from "../models/Flashcard.js";
import Document from "../models/Document.js";
import * as geminiService from "../utils/geminiService.js"; // adjust if needed

/* ================= GENERATE ================= */
export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "documentId is required"
      });
    }

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found"
      });
    }

    // ✅ FIXED FIELD
    const content = document.extractedText;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Document extractedText is empty"
      });
    }

    console.log("📄 CONTENT LENGTH:", content.length);
    console.log("📄 SAMPLE:", content.slice(0, 200));

    // ✅ LIMIT SIZE (IMPORTANT)
    const trimmedContent = content.slice(0, 4000);

    const prompt = `
You are an AI tutor.

Create 10 flashcards ONLY from the content below.

CONTENT:
"""
${trimmedContent}
"""

Rules:
- Only use given content
- No external knowledge
- Keep answers short

Return ONLY JSON:
[
  { "question": "...", "answer": "..." }
]
`;

    // ✅ USE GEMINI (NOT openai)
    const aiResponse = await geminiService.generateWithGemini(prompt);

    console.log("🤖 RAW AI RESPONSE:", aiResponse);

    let cards;

    try {
      const match = aiResponse.match(/\[\s*{[\s\S]*}\s*\]/);

      if (!match) throw new Error("No JSON found");

      cards = JSON.parse(match[0]);
    } catch (err) {
      console.error("❌ PARSE ERROR:", aiResponse);

      return res.status(500).json({
        success: false,
        error: "Failed to parse AI response"
      });
    }

    if (!Array.isArray(cards) || cards.length === 0) {
      return res.status(500).json({
        success: false,
        error: "AI returned invalid flashcards"
      });
    }

    const flashcardSet = await Flashcard.create({
      userId: req.user._id,
      documentId,
      cards
    });

    res.status(201).json({
      success: true,
      data: flashcardSet
    });

  } catch (error) {
    next(error);
  }
};

/* ================= GET BY DOCUMENT ================= */
export const getFlashcards = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "documentId is required"
      });
    }

    const flashcards = await Flashcard.find({
      userId: req.user._id,
      documentId
    })
      .populate("documentId", "title fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: flashcards,
      count: flashcards.length
    });
  } catch (error) {
    next(error);
  }
};


/* ================= GET ALL ================= */
export const getAllFlashcardSets = async (req, res, next) => {
  try {
    const flashcardSets = await Flashcard.find({
      userId: req.user._id
    })
      .populate("documentId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: flashcardSets,
      count: flashcardSets.length
    });
  } catch (error) {
    next(error);
  }
};


/* ================= REVIEW ================= */
export const reviewFlashcard = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      "cards._id": req.params.cardId,
      userId: req.user._id
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard not found"
      });
    }

    const card = flashcardSet.cards.id(req.params.cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: "Flashcard not found"
      });
    }

    card.lastReviewed = new Date();
    card.reviewCount = (card.reviewCount || 0) + 1;

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      data: card
    });

  } catch (error) {
    next(error);
  }
};


/* ================= TOGGLE ================= */
export const toggleFlashcard = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      "cards._id": req.params.cardId,
      userId: req.user._id
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard not found"
      });
    }

    const card = flashcardSet.cards.id(req.params.cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: "Flashcard not found"
      });
    }

    card.isStarred = !card.isStarred;

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      data: card
    });

  } catch (error) {
    next(error);
  }
};


/* ================= DELETE ================= */
export const deleteFlashcardSet = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Flashcard set deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};