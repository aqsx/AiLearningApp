import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

const getDocuments = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_ALL);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { success: false, error: "Network error" };
  }
};

const uploadDocument = async (formData) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.DOCUMENTS.UPLOAD,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { success: false, error: "Network error" };
  }
};

const deleteDocument = async (documentId) => {
  try {
    const response = await axiosInstance.delete(
      API_PATHS.DOCUMENTS.DELETE_DOCUMENT(documentId)
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { success: false, error: "Network error" };
  }
};

const getDocumentById = async (documentId) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(documentId)
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { success: false, error: "Network error" };
  }
};

const documentService = {
  getDocuments,
  uploadDocument,
  deleteDocument,
  getDocumentById,
};

export default documentService;
