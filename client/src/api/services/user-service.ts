import AxiosInstance from "../axios-instance";
import { UserRole } from "../../common/enums";

export const getUsers = async () => {
  try {
    const response = await AxiosInstance.get("/users", { withCredentials: true });
    return { success: true, status: response.status, users: response.data.users };
  } catch (error: any) {
    return { success: false, status: error.response?.status, message: error.response?.data?.message };
  }
};

export const addUser = async (username: string, password: string, roleId: UserRole) => {
  try {
    const response = await AxiosInstance.post("/users", { username, password, roleId }, { withCredentials: true });
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message };
  }
};

export const editUser = async (userId: number, username: string, roleId: UserRole) => {
  try {
    const response = await AxiosInstance.put(`/users/${userId}`, { username, roleId }, { withCredentials: true });

    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message };
  }
};

export const deleteUser = async (id: number) => {
  try {
    const response = await AxiosInstance.delete(`/users/${id}`, { withCredentials: true });
    return { success: true, message: response.data?.message };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message };
  }
};
