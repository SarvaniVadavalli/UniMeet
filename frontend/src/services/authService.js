import API from "./api";

const register = async (userData) => {
  const response = await API.post("auth/", userData);
  if (response.data) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData) => {
  const response = await API.post("auth/login", userData);
  if (response.data) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const getProfile = async () => {
  const response = await API.get("auth/profile");
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await API.post("auth/forgotpassword", { email });
  return response.data;
};

const resetPassword = async (token, password) => {
  const response = await API.put(`auth/resetpassword/${token}`, { password });
  return response.data;
};

const updateProfile = async (userData) => {
  const response = await API.put("auth/profile", userData);
  if (response.data) {
    // Token might be updated if name/email changed (depending on how token is generated)
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const deleteAccount = async () => {
  const response = await API.delete("auth/profile");
  if (response.data) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  deleteAccount,
  forgotPassword,
  resetPassword,
};

export default authService;
