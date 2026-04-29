import express from 'express';
import { 
    generateFlashcards,
    generateSummary,
    generateQuiz,
    chat,
    explainConcept,
    getChatHistory
} from '../controllers/aiController.js';
import protect from '../middleware/auth.js';
const router = express.Router();
router.use(protect);
router.post('/flashcards', generateFlashcards);
router.post('/summary', generateSummary);
router.post('/quiz', generateQuiz);
router.post('/chat', chat);
router.post('/explain', explainConcept);
router.get('/chat/history/:documentId', getChatHistory);
export default router;