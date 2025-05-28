import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieById } from "../api/services/movie-service";
import { toast } from "react-toastify";
import { deleteComment, getComments, postComment } from "../api/services/comment-service";
import CommentCard from "../components/comment-card";
import IComment from "../models/comment";
import { isNullOrEmpty } from "../utils/string";

const Details = () => {
  const { id: movieId } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchMovie = async () => {
      const result = await getMovieById(movieId!, controller.signal);

      if (result.success) {
        setMovie(result.movie);
      } else if (result.status === 401) {
        navigate("/login", { replace: true });
      } else {
        toast.error(result.message);
      }
    };

    const fetchComments = async () => {
      const result = await getComments(movieId!, controller.signal);

      if (result.success) {
        setComments(result.comments);
      } else {
        toast.error(result.message);
      }
    };

    fetchMovie();
    fetchComments();

    return () => controller.abort();
  }, [movieId]);

  const handlePostComment = async () => {
    if (isNullOrEmpty(newComment)) return;

    const result = await postComment(movieId!, newComment);

    if (result.success) {
      setNewComment("");
      toast.success("Comment posted successfully!");

      const commentResult = await getComments(movieId!);

      if (commentResult.success) {
        setComments(commentResult.comments);
      }
    } else {
      toast.error(result.message);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    const result = await deleteComment(+movieId!, commentId);

    if (result.success) {
      toast.success("Comment deleted successfully!");
      setComments((prev) => prev.filter((x) => x.id !== commentId));
    } else {
      toast.error(result.message);
    }
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6  rounded-2xl shadow-xl mt-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img src={movie.img} alt={movie.title} className="rounded-xl w-full h-auto object-cover shadow-md" />
        </div>

        <div className="md:w-2/3 space-y-4">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-purple-800 text-white px-3 py-1 rounded-full uppercase">{movie.type}</span>
            <span className="bg-blue-800 text-white px-3 py-1 rounded-full">Released: {movie.released}</span>
            <span className="bg-yellow-800 text-white px-3 py-1 rounded-full">IMDB: ⭐ {movie.imdbRating}</span>
            <span className="bg-green-800 text-white px-3 py-1 rounded-full">Genre: {movie.genre}</span>
          </div>

          <p className="text-lg">{movie.plot}</p>

          <div>
            <h2 className="text-md font-semibold">Actors:</h2>
            <p className="">{movie.actors}</p>
          </div>

          <div>
            <a
              href={`https://www.imdb.com/title/${movie.imdbId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl transition"
            >
              View on IMDb
            </a>
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-bold mt-5 mb-5">
        Comments <span className="text-2xl">({comments.length})</span>
      </h1>
      <div className="my-8 space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-4 border border-gray-300 rounded-xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <div className="flex justify-end">
          <button
            onClick={handlePostComment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md transition cursor-pointer"
          >
            Post Comment
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            commentId={comment.id}
            username={comment.username}
            comment={comment.comment}
            createdAt={comment.createdAt}
            userId={comment.userId}
            onCommentDelete={(commentId: number) => handleCommentDelete(commentId)}
          />
        ))}
      </div>
    </div>
  );
};

export default Details;
