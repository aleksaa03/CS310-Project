import { useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import MovieCard from "../components/movie-card";
import { toast } from "react-toastify";
import AxiosInstance from "../api/axios-instance";
import { useNavigate } from "react-router-dom";
import { addToWatchlist } from "../api/services/watchlist-service";
import { getMovies } from "../api/services/movie-service";

const App = () => {
  const [movies, setMovies] = useState([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const navigate = useNavigate();

  const fetchMovies = async (search: string, page: number, signal?: AbortSignal) => {
    try {
      const response = await AxiosInstance.get(`/movies?s=${search}&p=${page}`, {
        withCredentials: true,
        signal: signal,
      });

      setMovies(response.data.movies);
      setTotalResults(response.data.totalResults);
    } catch (error: any) {
      if (error.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
    }
  };

  useEffect(() => {
    if (!searchRef.current?.value) {
      return;
    }

    const controller = new AbortController();
    fetchMovies(searchRef.current?.value, page, controller.signal);

    return () => controller.abort();
  }, [page]);

  const handleSearchOnEnter = async (e: any) => {
    if (e.keyCode !== 13 || !searchRef.current) return;

    if (searchRef.current.value.length < 3) {
      return;
    }

    if (page !== 1) {
      setPage(1);
      return;
    }

    const result = await getMovies(searchRef.current?.value, page, typeRef.current?.value);

    if (result.success) {
      setMovies(result.movies);
      setTotalResults(result.totalResults);
    } else {
      if (result.status === 401) {
        navigate("/login", { replace: true });
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleListAdd = async (imdbId: string) => {
    const result = await addToWatchlist(imdbId);

    if (result.success) {
      toast.success(`Movie succesffully added to watchlist.`);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="search-movie p-5 w-full h-full overflow-auto">
      <h1 className="text-4xl font-bold text-center">Search for movies</h1>
      <div className="flex justify-center items-center gap-2 mt-5 flex-col sm:flex-row">
        <div className="flex items-center px-5 py-2 bg-gray-100 text-gray-600 rounded-lg focus-within:text-gray-600 focus-within:shadow-md w-[90%] sm:w-100">
          <MagnifyingGlassIcon className="size-4" />
          <input
            ref={searchRef}
            type="text"
            className="flex-grow px-5 text-base bg-transparent outline-none"
            name=""
            id=""
            placeholder="Search"
            onKeyUp={handleSearchOnEnter}
          />
        </div>
        <div className="py-2 sm:w-[initial] sm:text-[initial] w-[90%] text-center bg-gray-100 text-gray-600 rounded-lg focus-within:text-gray-600 focus-within:shadow-md">
          <select ref={typeRef} name="" id="" className="px-5 text-base bg-transparent outline-none">
            <option value="">Choose type</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="episode">Episode</option>
          </select>
        </div>
      </div>
      <div className="flex justify-center items-center w-full mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {movies.map((movie: any) => (
            <MovieCard
              key={movie.imdbID}
              title={movie.Title}
              img={
                movie.Poster && movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://www.westpokot.go.ke/wp-content/uploads/2017/11/dummy-5.jpg"
              }
              imdbId={movie.imdbID}
              type={movie.Type}
              year={movie.Year}
              onListAdd={(imdbId: string) => handleListAdd(imdbId)}
            />
          ))}
        </div>
      </div>
      <div className="pagination text-center mt-6 space-y-3">
        {totalResults > 0 && (
          <>
            <h1>
              Data: {Math.min((page - 1) * 10 + 1, totalResults)} - {Math.min(page * 10, totalResults)} / {totalResults}
            </h1>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 cursor-pointer"
                onClick={() => setPage((prev) => prev - 1)}
                disabled={page <= 1}
              >
                Previous
              </button>
              <button
                type="button"
                className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 cursor-pointer"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page >= Math.ceil(totalResults / 10)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
