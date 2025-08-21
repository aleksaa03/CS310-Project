import { Request, Response, Router } from "express";
import { auth } from "../middlewares/auth";
import AppDb from "../db";
import Movie from "../models/movie";
import ConflictError from "../errors/conflict-error";
import BadRequestError from "../errors/bad-request-error";
import NotFoundError from "../errors/not-found-error";
import NotAuthorizedError from "../errors/not-authorized-error";
import { API_KEY } from "../common/constants";
import { isNullOrEmpty } from "../utils/string";
import Watchlist from "../models/watch-list";
import Comment from "../models/comment";
import { isValidDateString } from "../utils/string";
import { addUserLog } from "../services/user-log-service";
import { UserLogType } from "../common/enums";

const router = Router();

router.post("/movies", auth, async (req: Request, res: Response) => {
  const { title, img, imdbId, type, released, imdbRating, plot, actors, genre } = req.body;

  const movieRepository = AppDb.getRepository(Movie);
  const existing = await movieRepository.findOneBy({ imdbId });

  if (existing) {
    throw new ConflictError("Movie already exists.");
  }

  const movie = movieRepository.create({
    title,
    img,
    imdbId,
    type,
    released: released ? new Date(released) : null,
    imdbRating,
    plot,
    actors,
    genre,
  });

  await movieRepository.save(movie);

  res.status(201).json({ movie });
});

router.get("/movies", auth, async (req: Request, res: Response) => {
  const search = req.query.s.toString();
  let page = +req.query.p;
  let type = req.query.type;

  let query = `apikey=${API_KEY}`;

  if (isNaN(page)) {
    page = 1;
  }

  query += `&page=${page}`;

  if (search.length < 3) {
    throw new BadRequestError("Search query must be at least 3 char long.");
  }

  query += `&s=${search}`;

  if (!isNullOrEmpty(type)) {
    query += `&type=${type}`;
  }

  const response = await fetch(`http://www.omdbapi.com/?${query}`);
  const content = await response.json();

  if (!response.ok) {
    throw new BadRequestError();
  }

  if (content.Response === "True") {
    res.status(200).json({ movies: content.Search, totalResults: +content.totalResults });
    return;
  } else if (content.Response === "False") {
    throw new BadRequestError(content.Error);
  }

  res.status(500).json({ message: "Internal server error" });
});

router.get("/movies/:movieId", auth, async (req: Request, res: Response) => {
  const movieId = +req.params.movieId;

  if (isNaN(movieId)) {
    throw new BadRequestError("Movie id must be number.");
  }

  const movieRepository = AppDb.getRepository(Movie);
  const movie = await movieRepository.findOneBy({ id: movieId });

  if (!movie) {
    throw new NotFoundError("Movie not found.");
  }

  const userId = req.currentUser?.id;
  const watchlistRepository = AppDb.getRepository(Watchlist);
  const watchlistItem = await watchlistRepository.findOneBy({ userId, movieId });

  const watched = watchlistItem?.watched ?? false;

  res.status(200).json({
    movie: {
      ...movie,
      watched,
    },
  });
});

router.get("/movies/imdb/:imdbId", auth, async (req: Request, res: Response) => {
  const imdbId = req.params.imdbId;

  if (isNullOrEmpty(imdbId)) {
    throw new BadRequestError("IMDB ID cannot be empty.");
  }

  const movieRepository = AppDb.getRepository(Movie);
  let movie = await movieRepository.findOneBy({ imdbId });

  if (!movie) {
    const response = await fetch(`http://www.omdbapi.com/?i=${imdbId}&apikey=${API_KEY}`);
    const content = await response.json();

    if (!response.ok) {
      throw new BadRequestError();
    }

    if (content.Response === "False") {
      throw new BadRequestError(content.Error);
    }

    if (!isValidDateString(content.Released)) {
      throw new BadRequestError("Invalid date format for released date.");
    }

    movie = movieRepository.create({
      title: content.Title,
      img: content.Poster,
      imdbId,
      type: content.Type,
      released: content.Released ? new Date(content.Released) : null,
      imdbRating: +content.imdbRating,
      plot: content.Plot,
      actors: content.Actors,
      genre: content.Genre,
    });

    await movieRepository.save(movie);
  }

  res.status(200).json({ movieId: movie.id });
});

router.post("/movies/:movieId/comments", auth, async (req: Request, res: Response) => {
  const comment = req.body.comment;
  const movieId = +req.params.movieId;

  if (isNaN(movieId)) {
    throw new BadRequestError("Movie id must be number.");
  }

  if (isNullOrEmpty(comment)) {
    throw new BadRequestError("Comment cannot be empty.");
  }

  const movieRepository = AppDb.getRepository(Movie);

  if (!(await movieRepository.exists({ where: { id: movieId } }))) {
    throw new NotFoundError("Movie not found.");
  }

  const commentRepository = AppDb.getRepository(Comment);

  const commentEntity = commentRepository.create({
    comment: comment.toString().trim(),
    userId: req.currentUser.id,
    movieId,
  });

  await commentRepository.save(commentEntity);
  res.status(201).json({ message: "Comment added successfully." });

  await addUserLog(
    req.currentUser.id,
    UserLogType.Add,
    `Added comment to movie with ID ${movieId}`,
    `Comment: ${commentEntity.comment}`
  );
});

router.get("/movies/:movieId/comments", auth, async (req: Request, res: Response) => {
  const movieId = +req.params.movieId;

  if (isNaN(movieId)) {
    throw new BadRequestError("Movie id must be number.");
  }

  const movieRepository = AppDb.getRepository(Movie);

  if (!(await movieRepository.exists({ where: { id: movieId } }))) {
    throw new NotFoundError("Movie not found.");
  }

  const commentRepository = AppDb.getRepository(Comment);

  const comments = await commentRepository.find({
    select: {
      id: true,
      comment: true,
      createdAt: true,
      user: {
        id: true,
        username: true,
      },
    },
    where: { movieId },
    relations: ["user"],
    order: { createdAt: "DESC" },
  });

  res.status(200).json({
    comments: comments.map((x) => ({
      id: x.id,
      comment: x.comment,
      createdAt: x.createdAt,
      username: x.user.username,
      userId: x.user.id,
    })),
  });
});

router.delete("/movies/:movieId/comments/:commentId", auth, async (req: Request, res: Response) => {
  const movieId = +req.params.movieId;
  const commentId = +req.params.commentId;

  if (isNaN(movieId) || isNaN(commentId)) {
    throw new BadRequestError("Movie id and comment id must be numbers.");
  }

  const commentRepository = AppDb.getRepository(Comment);
  const comment = await commentRepository.findOne({ where: { id: commentId } });

  if (comment.userId !== req.currentUser.id) {
    throw new NotAuthorizedError("You are not authorized to delete this comment.");
  }

  await commentRepository.delete({ id: commentId });

  res.status(200).json({ message: "Comment was removed." });

  await addUserLog(
    req.currentUser.id,
    UserLogType.Delete,
    `Deleted comment from movie with ID ${movieId}`,
    `Comment: ${comment.comment}`
  );
});

export { router as movieController };
