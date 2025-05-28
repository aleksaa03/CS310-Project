import AxiosInstance from "../axios-instance";

export const login = async (username: string, password: string) => {
  try {
    const response = await AxiosInstance.post("/login", { username, password }, { withCredentials: true });

    return { success: true, user: response.data.user };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message };
  }
};

export const register = async (username: string, password: string) => {
  try {
    await AxiosInstance.post("/register", { username, password }, { withCredentials: true });

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message };
  }
};

export const logout = async () => {
  try {
    const response = await AxiosInstance.delete("/logout", { withCredentials: true });
    return { success: true, message: response.data?.message };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message };
  }
};

export const checkAuth = async (signal?: AbortSignal) => {
  try {
    const response = await AxiosInstance.get("/check-auth", { withCredentials: true, signal });

    return { success: true, user: response.data.user };
  } catch (error: any) {
    return { success: false, status: error.response?.status, message: error.response?.data?.message };
  }
};
