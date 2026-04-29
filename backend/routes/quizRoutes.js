import express from 'express';
import {
    getQuizByDocument,

    getQuizById,
    submitQuiz,
    getQuizResults,
    deleteQuiz
} from '../controllers/quizController.js';
import protect from '../middleware/auth.js';
const router = express.Router();
router.use(protect);
router.get("/quiz/:documentId", getQuizByDocument);

router.get('/:id', getQuizById);
router.post('/:id/submit', submitQuiz);
router.get('/:id/results', getQuizResults);
router.delete('/:id', deleteQuiz);
export default router;