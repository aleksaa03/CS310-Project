import AxiosInstance from "../axios-instance";

export const getUserLogs = async () => {
  try {
    const response = await AxiosInstance.get("/user-logs", { withCredentials: true });
    return { success: true, status: response.status, userLogs: response.data.userLogs };
  } catch (error: any) {
    return { success: false, status: error.response?.status, message: error.response?.data?.message };
  }
};
