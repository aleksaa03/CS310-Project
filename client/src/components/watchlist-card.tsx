import { CheckCircleIcon, InformationCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  movieId: number;
  img: string;
  title: string;
  type: string;
  year: string;
  imdbId: string;
  watched: boolean;
  onWatchedChange: (e: React.ChangeEvent, movieId: number) => void;
  onRemoveFromWatchList: (movieId: number) => void;
};

const WatchListCard = ({
  movieId,
  img,
  title,
  type,
  year,
  imdbId,
  watched,
  onWatchedChange,
  onRemoveFromWatchList,
}: Props) => {
  const navigate = useNavigate();

  const showDetails = (movieId: number) => {
    navigate(`/details/${movieId}`);
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
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer text-gray-700">
            <input
              type="checkbox"
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              onChange={(e) => onWatchedChange(e, movieId)}
              defaultChecked={watched}
            />
            <CheckCircleIcon className={`w-5 h-5 ${watched ? "text-blue-600" : "text-red-600"}`} />
            <span className="select-none">{watched ? "Watched" : "Unwatched"}</span>
          </label>

          <button
            className="p-1 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition cursor-pointer"
            aria-label="Details"
            onClick={() => showDetails(movieId)}
          >
            <InformationCircleIcon className="w-6 h-6" />
          </button>

          <button
            className="p-1 text-red-600 rounded hover:bg-red-600 hover:text-white transition cursor-pointer"
            aria-label="Remove from list"
            onClick={() => onRemoveFromWatchList(movieId)}
          >
            <TrashIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchListCard;
