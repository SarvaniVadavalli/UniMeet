import api from "./api";

export const createAppointment = async (appointmentData) => {
  const response = await api.post("appointments", appointmentData);
  return response.data;
};

export const getMyAppointments = async () => {
  const response = await api.get("appointments/me");
  return response.data;
};

export const updateAppointmentStatus = async (
  id,
  status,
  responseNote = "",
) => {
  const response = await api.patch(`appointments/${id}/status`, {
    status,
    responseNote,
  });
  return response.data;
};

export const updateAppointmentAgenda = async (id, agenda) => {
  const response = await api.patch(`appointments/${id}/agenda`, { agenda });
  return response.data;
};
