import api from "./api";

export const reportIssue = async (issueData) => {
  const response = await api.post("issues", issueData);
  return response.data;
};

export const getMyIssues = async () => {
  const response = await api.get("issues/me");
  return response.data;
};

export const getAllIssues = async () => {
  const response = await api.get("issues");
  return response.data;
};

export const updateIssueStatus = async (id, status) => {
  const response = await api.patch(`issues/${id}`, { status });
  return response.data;
};
