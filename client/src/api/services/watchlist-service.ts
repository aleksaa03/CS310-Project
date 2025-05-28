import AxiosInstance from "../axios-instance";

export const addToWatchlist = async (imdbId: string) => {
  try {
    const response = await AxiosInstance.post("/watch-list", { imdbId }, { withCredentials: true });

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message,
    };
  }
};

export const getWatchlist = async (signal?: AbortSignal) => {
  try {
    const response = await AxiosInstance.get("/watch-list", { withCredentials: true, signal });

    return { success: true, movies: response.data.movies };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message };
  }
};

export const updateWatchedStatus = async (movieId: number, watched: boolean) => {
  try {
    await AxiosInstance.patch(`/watch-list/${movieId}`, { watched }, { withCredentials: true });

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message,
    };
  }
};

export const removeFromWatchlist = async (movieId: number) => {
  try {
    await AxiosInstance.delete(`/watch-list/${movieId}`, { withCredentials: true });
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message,
    };
  }
};
