import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { getMovieIdByIMDBId } from "../api/services/movie-service";
import { toast } from "react-toastify";

type Props = {
  title: string;
  img: string;
  imdbId: string;
  type: string;
  year: string;
  onListAdd: (imdbId: string) => void;
};

const MovieCard = ({ title, img, imdbId, type, year, onListAdd }: Props) => {
  const navigate = useNavigate();

  const showDetails = async (imdbId: string) => {
    const result = await getMovieIdByIMDBId(imdbId);

    if (result.success) {
      navigate(`/details/${result.movieId}`);
    } else {
      if (result.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      toast.error(result.message);
    }
  };

  return (
    <div className="max-w-md shadow-lg rounded-2xl overflow-hidden flex flex-col sm:flex-row p-4 sm:w-96">
      <div className="flex justify-center sm:flex-none sm:justify-[initial] flex-shrink-0">
        <img src={img} alt={`Poster of ${title}`} className="w-28 h-40 object-cover rounded-lg shadow-sm" />
      </div>

      <div className="flex flex-col justify-between sm:ml-4 mt-3 sm:mt-0 w-full">
        <div>
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-bold">{title}</h2>
            <a
              href={`https://www.imdb.com/title/${imdbId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded-md"
            >
              IMDb
            </a>
          </div>
          <div className="mt-1 text-sm capitalize">{type}</div>
          <div className="text-sm">{year}</div>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => onListAdd(imdbId)}
            className="self-start bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded-md cursor-pointer"
          >
            Add to Watchlist
          </button>
          <button
            className="p-1 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition cursor-pointer"
            aria-label="Details"
            onClick={() => showDetails(imdbId)}
          >
            <InformationCircleIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
