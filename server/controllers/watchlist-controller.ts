import { Request, Response, Router } from "express";
import AppDb from "../db";
import { API_KEY } from "../common/constants";
import { auth } from "../middlewares/auth";
import Movie from "../models/movie";
import BadRequestError from "../errors/bad-request-error";
import NotFoundError from "../errors/not-found-error";
import { isValidDateString } from "../utils/string";
import Watchlist from "../models/watch-list";
import { UserLogType } from "../common/enums";
import { addUserLog } from "../services/user-log-service";

const router = Router();

router.post("/watch-list", auth, async (req: Request, res: Response) => {
  const { imdbId } = req.body;

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

  const userId = req.currentUser?.id;
  const watchlistRepository = AppDb.getRepository(Watchlist);

  const existingWatchlist = await watchlistRepository.findOne({
    where: { userId, movieId: movie.id },
  });

  if (existingWatchlist) {
    throw new BadRequestError("Movie is already in your watchlist.");
  }

  const watchlistItem = watchlistRepository.create({
    userId,
    movieId: movie.id,
  });

  await watchlistRepository.save(watchlistItem);

  res.status(201).json({ message: "Movie added to your watchlist." });

  await addUserLog(
    userId,
    UserLogType.Add,
    `Added movie to watchlist with ID ${movie.id}`,
    `Movie: ${movie.id}, ${movie.title}`
  );
});

router.get("/watch-list", auth, async (req: Request, res: Response) => {
  const userId = req.currentUser?.id;

  const watchlistRepository = AppDb.getRepository(Watchlist);
  const watchlistItems = await watchlistRepository.find({
    where: { userId },
    relations: ["movie"],
  });

  const movies = watchlistItems.map((item) => ({
    ...item.movie,
    watched: item.watched,
  }));

  res.status(200).json({ movies });
});

router.patch("/watch-list/:movieId", auth, async (req: Request, res: Response) => {
  const movieId = +req.params.movieId;
  const watched = req.body.watched;

  if (isNaN(movieId)) {
    throw new BadRequestError("Movie id must be number.");
  }

  const userId = req.currentUser?.id;

  const watchlistRepository = AppDb.getRepository(Watchlist);
  const watchlistItem = await watchlistRepository.findOne({
    where: { userId, movieId },
  });

  if (!watchlistItem) {
    throw new BadRequestError("Movie not found in your watchlist.");
  }

  const lastWatchStatus = watchlistItem.watched;

  watchlistItem.watched = watched;

  await watchlistRepository.save(watchlistItem);

  res.status(200).json({ message: "Watch status updated successfully." });

  await addUserLog(
    userId,
    UserLogType.Update,
    `Changed watch status for movie with ID ${movieId}`,
    `Watch status: ${lastWatchStatus ? "watched" : "unwatched"} -> ${watched ? "watched" : "unwatched"}`
  );
});

router.delete("/watch-list/:movieId", auth, async (req: Request, res: Response) => {
  const movieId = +req.params.movieId;

  if (isNaN(movieId)) {
    throw new BadRequestError("Movie id must be number.");
  }

  const watchlistRepository = AppDb.getRepository(Watchlist);

  if (!(await watchlistRepository.exists({ where: { userId: req.currentUser?.id, movieId } }))) {
    throw new NotFoundError("Movie not found in your watchlist.");
  }

  await watchlistRepository.delete({ userId: req.currentUser?.id, movieId });

  res.status(200).json({ message: "Movie removed from your watchlist." });

  await addUserLog(
    req.currentUser.id,
    UserLogType.Delete,
    `Removed movie from watchlist with ID ${movieId}`,
    `Movie ID: ${movieId}`
  );
});

export { router as watchlistController };
