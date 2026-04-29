import axiosinstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

/* ================= GET QUIZ BY DOCUMENT ================= */
const getQuizzes = async (documentId) => {
  try {
    const response = await axiosinstance.get(
      API_PATHS.QUIZZES.GET_QUIZ_BY_DOCUMENT(documentId)
    );

    return response.data?.data || [];
  } catch (error) {
    console.error("QUIZ FETCH ERROR:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    return [];
  }
};

/* ================= GET QUIZ BY ID ================= */
const getQuizById = async (quizId) => {
  try {
    const res = await axiosinstance.get(
      API_PATHS.QUIZZES.GET_QUIZ_BY_ID(quizId)
    );

    return res.data?.data; // ✅ IMPORTANT FIX
  } catch (error) {
    console.error("GET QUIZ ERROR:", error);
    return null;
  }
};

/* ================= SUBMIT QUIZ ================= */
const submitQuiz = async (quizId, answers) => {
  try {
    const res = await axiosinstance.post(
      API_PATHS.QUIZZES.SUBMIT_QUIZ(quizId),
      { answers }
    );
    return res.data;
  } catch (error) {
    console.error("SUBMIT ERROR:", error);
    throw error.response?.data || { message: "Network error" };
  }
};

/* ================= GET RESULTS ================= */
export const getQuizResults = async (quizId) => {
  try {
    const res = await axiosinstance.get(
      API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId)
    );

    console.log("SERVICE RESULT:", res.data); // 🔍 debug

    return res.data?.data;   // ✅ FIXED (IMPORTANT)
  } catch (error) {
    console.error("RESULT ERROR:", error);
    return null; // prevent crash
  }
};
/* ================= DELETE ================= */
const deleteQuiz = async (quizId) => {
  try {
    const res = await axiosinstance.delete(
      API_PATHS.QUIZZES.DELETE_QUIZ(quizId)
    );
    return res.data;
  } catch (error) {
    console.error("DELETE ERROR:", error);
    throw error.response?.data || { message: "Network error" };
  }
};

export default {
  getQuizzes,
  getQuizById,
  submitQuiz,
  getQuizResults,
  deleteQuiz,
};