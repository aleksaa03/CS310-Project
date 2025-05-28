import { DataSource } from "typeorm";
import User from "./models/user";
import Movie from "./models/movie";
import Watchlist from "./models/watch-list";
import Comment from "./models/comment";

const AppDb = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "username",
  password: "password",
  database: "it354_project",
  entities: [User, Movie, Watchlist, Comment],
  synchronize: false,
});

export default AppDb;
