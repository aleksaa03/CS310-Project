import { Request, Response, Router } from "express";
import AppDb from "../db";
import User from "../models/user";
import { isNullOrEmpty } from "../utils/string";
import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflict-error";
import NotFoundError from "../errors/not-found-error";
import NotAuthorizedError from "../errors/not-authorized-error";
import bcrypt from "bcrypt";
import { UserRole } from "../common/enums";
import { auth } from "../middlewares/auth";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../common/constants";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (isNullOrEmpty(username) || isNullOrEmpty(password)) {
    throw new BadRequestError("Username or password missing");
  }

  if (username.length < 5 || password.length < 5) {
    throw new BadRequestError("Username and password must be minimun 5 characters long.");
  }

  const entity = await AppDb.getRepository(User).findOne({ where: { username } });

  if (entity !== null) {
    throw new ConflictError("User already exists.");
  }

  const user = AppDb.getRepository(User).create({
    username,
    password: await bcrypt.hash(password, 10),
    roleId: UserRole.Client,
  });

  await AppDb.getRepository(User).save(user);

  res.status(201).json({
    user: { id: user.id, username: user.username, roleId: user.roleId },
    message: "User created successfully.",
  });
});

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (isNullOrEmpty(username) || isNullOrEmpty(password)) {
    throw new BadRequestError("Username or password missing");
  }

  if (username.length < 5 || password.length < 5) {
    throw new BadRequestError("Username and password must be minimun 5 characters long.");
  }

  const user = await AppDb.getRepository(User).findOne({ where: { username } });

  if (user === null) {
    throw new NotFoundError("User don't exists in the system.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new NotAuthorizedError("Invalid credentals");
  }

  const token = jwt.sign({ id: user.id, username: user.username, roleId: user.roleId }, JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  res
    .status(200)
    .json({ user: { id: user.id, username: user.username, roleId: user.roleId }, message: "Login successful." });
});

router.delete("/logout", auth, async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.sendStatus(200);
});

router.get("/check-auth", auth, async (req: Request, res: Response) => {
  const user = await AppDb.getRepository(User).findOne({ where: { id: req.currentUser.id } });

  res.status(200).json({ user });
});

export { router as authController };
