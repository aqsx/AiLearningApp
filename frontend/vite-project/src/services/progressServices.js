import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";


/* ================================
   Get progress by document ID
================================ */
export const getProgressByDocumentId = async (documentId) => {

  try {

    const response =
      await axiosInstance.get(
        API_PATHS.PROGRESS.GET_BY_DOCUMENT_ID(documentId)
      );

    return response.data;

  }

  catch (error) {

    console.error("Progress error:", error);

    throw error.response
      ? error.response.data
      : {
          success: false,
          error: "Network error",
        };

  }

};


/* ================================
   Get dashboard data
================================ */
export const getDashboardData = async () => {

  try {

    const response =
      await axiosInstance.get(
        API_PATHS.PROGRESS.GET_DASHBOARD
      );

    /*
      backend response format:
      {
        success: true,
        data: {
          overview:{},
          flashcardSets:[]
        }
      }
    */

    return response.data;

  }

  catch (error) {

    console.error("Dashboard error:", error);

    throw error.response
      ? error.response.data
      : {
          success: false,
          error: "Network error",
        };

  }

};


/* ================================
   Export object (IMPORTANT)
================================ */
const progressServices = {

  getProgressByDocumentId,
  getDashboardData,

};

export default progressServices;
