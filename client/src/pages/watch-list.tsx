import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getWatchlist, removeFromWatchlist, updateWatchedStatus } from "../api/services/watchlist-service";
import WatchListCard from "../components/watchlist-card";

const WatchList = () => {
  const [watchListMovies, setWatchListMovies] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchWatchlist = async () => {
      const result = await getWatchlist(controller.signal);

      if (result.success) {
        setWatchListMovies(result.movies);
      } else {
        toast.error(result.message);
      }
    };

    fetchWatchlist();

    () => controller.abort();
  }, []);

  const handleWatchedChange = async (e: any, movieId: number) => {
    const watched = e.target.checked;

    const result = await updateWatchedStatus(movieId, watched);

    if (result.success) {
      toast.success(`Movie marked as ${watched ? "Watched" : "Unwatched"}`);

      setWatchListMovies((prevMovies: any) =>
        prevMovies.map((movie: any) => (movie.id === movieId ? { ...movie, watched: watched } : movie))
      );
    } else {
      toast.error(result.message);
    }
  };

  const handleRemoveFromWatchList = async (movieId: number) => {
    const result = await removeFromWatchlist(movieId);

    if (result.success) {
      toast.success("Movie removed from watch list");
      setWatchListMovies((prevMovies: any) => prevMovies.filter((movie: any) => movie.id !== movieId));
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="p-10 w-full h-full overflow-auto">
      <h1 className="text-4xl font-bold">Watchlist</h1>
      <div className="flex justify-start items-center w-full mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-[initial]">
          {watchListMovies.map((movie: any) => (
            <WatchListCard
              key={movie.id}
              movieId={movie.id}
              img={movie.img}
              title={movie.title}
              type={movie.type}
              year={movie.year}
              imdbId={movie.imdbId}
              watched={movie.watched}
              onWatchedChange={handleWatchedChange}
              onRemoveFromWatchList={handleRemoveFromWatchList}
            />
          ))}
          {watchListMovies.length === 0 && (
            <p className="text-gray-500 italic text-center">
              Your watchlist is feeling a little lonely... Add something worth watching! 🎬🍿
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchList;
