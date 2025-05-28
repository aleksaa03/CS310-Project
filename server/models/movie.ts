import { Entity, Column, OneToMany } from "typeorm";
import Base from "./base";
import Watchlist from "./watch-list";
import Comment from "./comment";

@Entity({ name: "movies" })
export default class Movie extends Base {
  @Column({ name: "title", type: "text" })
  title: string;

  @Column({ name: "img", type: "text", nullable: true })
  img: string;

  @Column({ name: "imdb_id", type: "varchar", length: 20, unique: true })
  imdbId: string;

  @Column({ name: "type", type: "text", nullable: true })
  type: string;

  @Column({ name: "released", type: "date", nullable: true })
  released: Date;

  @Column({ name: "imdb_rating", type: "numeric", precision: 3, scale: 1, nullable: true })
  imdbRating: number;

  @Column({ name: "plot", type: "text", nullable: true })
  plot: string;

  @Column({ name: "actors", type: "text", nullable: true })
  actors: string;

  @Column({ name: "genre", type: "text", nullable: true })
  genre: string;

  @OneToMany(() => Watchlist, (watchlist) => watchlist.movie)
  watchlistedBy: Watchlist[];

  @OneToMany(() => Comment, (comment) => comment.movie)
  comments: Comment[];
}
