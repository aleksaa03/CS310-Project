import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import Base from "./base";
import User from "./user";
import Movie from "./movie";

@Entity({ name: "comments" })
export default class Comment extends Base {
  @Column({ name: "comment", type: "text" })
  public comment: string;

  @Column({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  public createdAt: Date;

  @Column({ name: "user_id", type: "integer" })
  userId: number;

  @Column({ name: "movie_id", type: "integer" })
  movieId: number;

  @ManyToOne(() => User, (user) => user.watchlist, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.watchlistedBy, { onDelete: "CASCADE" })
  @JoinColumn({ name: "movie_id" })
  movie: Movie;
}
