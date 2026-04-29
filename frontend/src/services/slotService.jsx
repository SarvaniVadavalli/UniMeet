import api from "./api";

export const createSlot = async (slotData) => {
  const response = await api.post("slots", slotData);
  return response.data;
};

export const getMySlots = async () => {
  const response = await api.get("slots/me");
  return response.data;
};

export const deleteSlot = async (id) => {
  const response = await api.delete(`slots/${id}`);
  return response.data;
};
