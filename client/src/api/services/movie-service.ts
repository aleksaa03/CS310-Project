import AxiosInstance from "../axios-instance";

export const getMovies = async (search: string, page: number, type?: string) => {
  let route = `/movies?s=${search}&p=${page}`;

  if (type) {
    route += `&type=${type}`;
  }

  try {
    const response = await AxiosInstance.get(route, {
      withCredentials: true,
    });

    return {
      success: true,
      movies: response.data.movies,
      totalResults: response.data.totalResults,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      status: error.response?.status,
      message: error.response?.data?.message,
    };
  }
};

export const getMovieById = async (movieId: string, signal?: AbortSignal) => {
  try {
    const response = await AxiosInstance.get(`/movies/${movieId}`, {
      withCredentials: true,
      signal,
    });

    return {
      success: true,
      movie: response.data.movie,
    };
  } catch (error: any) {
    return {
      success: false,
      status: error.response?.status,
      message: error.response?.data?.message || "Failed to fetch movie.",
    };
  }
};

export const getMovieIdByIMDBId = async (imdbId: string) => {
  try {
    const response = await AxiosInstance.get(`/movies/imdb/${imdbId}`, { withCredentials: true });
    return { success: true, movieId: response.data.movieId };
  } catch (error: any) {
    return { success: false, status: error.response?.status, message: error.response?.data?.message };
  }
};
