import express from "express";
import "express-async-errors";
import "reflect-metadata";
import http from "http";
import cors from "cors";
import AppDb from "./db";
import { PORT } from "./common/constants";
import { errorHandler } from "./middlewares/error-handler";
import cookieParser from "cookie-parser";
import { authController } from "./controllers/auth-controller";
import { movieController } from "./controllers/movie-controller";
import { watchlistController } from "./controllers/watchlist-controller";
import { userController } from "./controllers/user-controller";
import { userLogController } from "./controllers/user-log-controller";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.setMaxListeners(Infinity);
server.setMaxListeners(Infinity);

AppDb.initialize()
  .then(() => {
    console.log("Connection to database has been established successfully.");
  })
  .catch((error) => {
    console.log(`Unable to connect to the database: ${error.message}`);
    process.exit(1);
  });

app.use(authController);
app.use(movieController);
app.use(watchlistController);
app.use(userController);
app.use(userLogController);

app.use(errorHandler);

process.on("uncaughtException", (err) => {
  console.log(err.message);
});

server.listen(PORT, () => {
  console.log(`Server is live at ${PORT} port.`);
});
