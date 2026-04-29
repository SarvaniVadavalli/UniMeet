import api from "./api";

export const getGlobalStats = async () => {
  const response = await api.get("admin/stats");
  return response.data;
};
export const getAllUsers = async () => {
  const response = await api.get("admin/users");
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`admin/users/${id}`);
  return response.data;
};

export const getAllAppointments = async () => {
  const response = await api.get("admin/appointments");
  return response.data;
};
