import api from "./api";

export const getFaculties = async () => {
  const response = await api.get("faculty");
  return response.data;
};

export const getFacultyById = async (id) => {
  const response = await api.get(`faculty/${id}`);
  return response.data;
};

export const updateMyProfile = async (profileData) => {
  const response = await api.put("faculty/profile", profileData);
  return response.data;
};
