import { UserLogType } from "../../common/enums";
import AxiosInstance from "../axios-instance";

export const getUserLogs = async (
  page: number,
  pageSize: number,
  sortExp: string | null,
  sortOrd: string | null,
  { action }: { action: UserLogType | null }
) => {
  try {
    const response = await AxiosInstance.get("/user-logs", {
      withCredentials: true,
      params: { page, pageSize, sortExp, sortOrd, action },
    });
    return {
      success: true,
      status: response.status,
      userLogs: response.data.userLogs,
      total: response.data.total,
      totalPages: response.data.totalPages,
    };
  } catch (error: any) {
    return { success: false, status: error.response?.status, message: error.response?.data?.message };
  }
};
