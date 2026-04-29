export const BASE_URL = 'http://localhost:8000/api';

export const API_PATHS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    GET_PROFILE: "/auth/profile",
    UPDATE_PROFILE: "/auth/profile/update",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  DOCUMENTS: {
    UPLOAD: "/documents/upload",
    GET_ALL: "/documents",
    GET_DOCUMENT_BY_ID: (id) => `/documents/${id}`,
    DELETE_DOCUMENT: (id) => `/documents/${id}`,
  },

  AI: {
  GENERATE_FLASHCARDS: "/ai/flashcards",
  GENERATE_QUIZ: "/ai/quiz",
  GENERATE_SUMMARY: "/ai/summary",
  CHAT: "/ai/chat",
  EXPLAIN_CONCEPT: "/ai/explain",
  GET_CHAT_HISTORY: (documentId) => `/ai/chat/history/${documentId}`,
},

  FLASHCARDS: {
  GET_ALL_FLASHCARD_SETS: "/flashcards",
  GET_FLASHCARDS_BY_DOCUMENT_ID: (documentId) =>
    `/flashcards/${documentId}`,   // ✅ FIXED
  REVIEW_FLASHCARD: (cardId) =>
    `/flashcards/${cardId}/review`,
  TOGGLE_STAR: (cardId) =>
    `/flashcards/${cardId}/star`,
  DELETE: (id) =>
    `/flashcards/${id}`,
},

  QUIZZES: {
  /* ================= API ================= */
  GET_QUIZ_BY_DOCUMENT: (documentId) => `/quizzes/quiz/${documentId}`,
  GET_QUIZ_BY_ID: (quizId) => `/quizzes/${quizId}`,
  SUBMIT_QUIZ: (quizId) => `/quizzes/${quizId}/submit`,
  GET_QUIZ_RESULTS: (quizId) => `/quizzes/${quizId}/results`,
  DELETE_QUIZ: (quizId) => `/quizzes/${quizId}`,

  /* ================= FRONTEND ROUTES ================= */
  TAKE_QUIZ_PAGE: (quizId) => `/quizzes/${quizId}`,
  QUIZ_RESULT_PAGE: (quizId) => `/quizzes/${quizId}/results`, // ✅ FIXED
},
  PROGRESS: {
    GET_DASHBOARD: "/progress/dashboard",
  },
};
