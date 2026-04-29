import axiosinstance from '../utils/axiosinstance';
import { API_PATHS } from '../utils/apiPaths';

/* ===============================
   COMMON ERROR HANDLER
================================ */
const handleError = (error, label) => {
    console.error(`${label} ERROR:`, error);

    throw error?.response?.data || {
        success: false,
        message: "Network error",
    };
};

/* ===============================
   FLASHCARDS
================================ */
export const generateFlashcards = async (documentId) => {
    try {
        console.log("Generating Flashcards for:", documentId);

        const response = await axiosinstance.post(
            API_PATHS.AI.GENERATE_FLASHCARDS,
            { documentId }
        );

        return {
            success: true,
            data: response.data,
        };

    } catch (error) {
        handleError(error, "FLASHCARDS");
    }
};

/* ===============================
   QUIZ
================================ */
export const generateQuiz = async (documentId) => {
    try {
        console.log("Generating Quiz for:", documentId);

        const response = await axiosinstance.post(
            API_PATHS.AI.GENERATE_QUIZ,
            { documentId }
        );

        return {
            success: true,
            data: response.data,
        };

    } catch (error) {
        handleError(error, "QUIZ");
    }
};

/* ===============================
   SUMMARY (FIXED)
================================ */
export const generateSummary = async (documentId) => {
    try {
        console.log("Generating Summary for:", documentId);

        const response = await axiosinstance.post(
            API_PATHS.AI.GENERATE_SUMMARY,
            { documentId }
        );

        console.log("SUMMARY RESPONSE:", response.data);

        const data = response.data;

        return {
            success: true,
            summary:
                data?.summary ||
                data?.answer ||
                data?.data ||
                data ||
                "No summary generated",
        };

    } catch (error) {
        handleError(error, "SUMMARY");
    }
};

/* ===============================
   EXPLAIN CONCEPT (FIXED)
================================ */
export const explainConcept = async (documentId, concept) => {
    try {
        console.log("Explain Concept:", concept);

        const response = await axiosinstance.post(
            API_PATHS.AI.EXPLAIN_CONCEPT,
            { documentId, concept }
        );

        console.log("EXPLAIN RESPONSE:", response.data);

        const data = response.data;

        return {
            success: true,
            answer:
                data?.answer ||
                data?.explanation ||
                data?.data ||
                data ||
                "No explanation generated",
        };

    } catch (error) {
        handleError(error, "EXPLAIN");
    }
};

/* ===============================
   CHAT
================================ */
export const chatWithAI = async (documentId, question) => {
    try {
        console.log("Chat Request:", { documentId, question });

        const response = await axiosinstance.post('/ai/chat', {
            documentId,
            question
        });

        console.log("🔥 RAW CHAT RESPONSE:", response.data);

        const data = response.data;

        return {
            success: true,
            answer:
                data?.answer ||
                data?.response ||
                data?.data ||
                data?.message ||
                data ||
                "No response",
        };

    } catch (error) {
        handleError(error, "CHAT");
    }
};

/* ===============================
   CHAT HISTORY
================================ */
export const getChatHistory = async (documentId) => {
    try {
        console.log("Fetching Chat History:", documentId);

        const response = await axiosinstance.get(
            API_PATHS.AI.GET_CHAT_HISTORY(documentId)
        );

        return {
            success: true,
            data: response.data,
        };

    } catch (error) {
        handleError(error, "CHAT HISTORY");
    }
};

/* ===============================
   EXPORT
================================ */
const aiService = {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    explainConcept,
    chatWithAI,
    getChatHistory,
};

export default aiService;