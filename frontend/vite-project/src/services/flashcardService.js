import axiosinstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

/* ================= GET ALL ================= */
export const getAllFlashcardSets = async () => {
  try {
    const response = await axiosinstance.get(
      API_PATHS.FLASHCARDS.GET_ALL_FLASHCARD_SETS
    );

    return (
      response.data?.data ||
      response.data?.flashcards ||
      response.data ||
      []
    );
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Network error" };
  }
};

/* ================= GET BY DOCUMENT ================= */
export const getFlashcardsForDocument = async (documentId) => {
  try {
    const response = await axiosinstance.get(
      API_PATHS.FLASHCARDS.GET_FLASHCARDS_BY_DOCUMENT_ID(documentId)
    );

    return (
      response.data?.data ||
      response.data?.flashcards ||
      response.data ||
      []
    );
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Network error" };
  }
};

/* ================= DELETE ================= */
export const deleteFlashcardSet = async (id) => {
  try {
    const response = await axiosinstance.delete(
      API_PATHS.FLASHCARDS.DELETE(id)
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Network error" };
  }
};

/* ================= REVIEW ================= */
export const reviewFlashcard = async (cardId, rating) => {
  try {
    const response = await axiosinstance.post(
      API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId),
      { rating }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Network error" };
  }
};

/* ✅ ALIAS FIX */
const getAllFlashcards = getAllFlashcardSets;

const flashcardService = {
  getAllFlashcardSets,
  getAllFlashcards, // ✅ important
  getFlashcardsForDocument,
  deleteFlashcardSet,
  reviewFlashcard,
};

export default flashcardService;