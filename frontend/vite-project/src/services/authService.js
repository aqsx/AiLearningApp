import axiosinstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

// LOGIN

const login = async (email, password) => {

  const response =
    await axiosinstance.post(
      API_PATHS.AUTH.LOGIN,
      { email, password }
    );

  return response.data;

};

const register = async (username, email, password) => {
  try {
    const response = await axiosinstance.post('/auth/register', {
      username, // Ensure this matches your backend req.body key
      email,
      password
    });

    // If your backend automatically logs them in after register:
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    // We throw the error so the Component can catch it and show a toast
    throw error.response?.data || { message: "Registration failed" };
  }
};
// GET PROFILE
const getProfile = async () => {
  try {
    const response = await axiosinstance.get(
      API_PATHS.AUTH.GET_PROFILE
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      success: false,
      error: "Network error",
    };
  }
};

// UPDATE PROFILE
const updateProfile = async (name, email) => {
  try {
    const response = await axiosinstance.put(
      API_PATHS.AUTH.UPDATE_PROFILE,
      { name, email }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      success: false,
      error: "Network error",
    };
  }
};

// CHANGE PASSWORD
const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axiosinstance.post(
      API_PATHS.AUTH.CHANGE_PASSWORD,
      { currentPassword, newPassword }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      success: false,
      error: "Network error",
    };
  }
};

const authService = {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
};

export default authService;
