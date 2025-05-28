import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import Base from "./base";
import User from "./user";
import Movie from "./movie";

@Entity({ name: "watchlist" })
export default class Watchlist extends Base {
  @Column({ name: "user_id", type: "integer" })
  userId: number;

  @Column({ name: "movie_id", type: "integer" })
  movieId: number;

  @Column({ name: "watched", type: "boolean", default: false })
  watched: boolean;

  @ManyToOne(() => User, (user) => user.watchlist, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.watchlistedBy, { onDelete: "CASCADE" })
  @JoinColumn({ name: "movie_id" })
  movie: Movie;
}
