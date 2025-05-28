import AxiosInstance from "../axios-instance";

export const postComment = async (movieId: string, comment: string) => {
  try {
    const response = await AxiosInstance.post(`/movies/${movieId}/comments`, { comment }, { withCredentials: true });
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message };
  }
};

export const getComments = async (movieId: string, signal?: AbortSignal) => {
  try {
    const response = await AxiosInstance.get(`/movies/${movieId}/comments`, { withCredentials: true, signal });
    return { success: true, comments: response.data.comments };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message };
  }
};

export const deleteComment = async (movieId: number, commentId: number) => {
  try {
    const response = await AxiosInstance.delete(`/movies/${movieId}/comments/${commentId}`, { withCredentials: true });
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message };
  }
};
