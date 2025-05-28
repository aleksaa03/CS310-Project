import { Request, Response, Router } from "express";
import AppDb from "../db";
import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflict-error";
import NotFoundError from "../errors/not-found-error";
import { isNullOrEmpty } from "../utils/string";
import { auth } from "../middlewares/auth";
import { validateRole } from "../middlewares/validate-role";
import { UserRole } from "../common/enums";
import User from "../models/user";
import bcrypt from "bcrypt";

const router = Router();

router.post("/users", auth, validateRole(UserRole.Admin), async (req: Request, res: Response) => {
  const { username, password, roleId } = req.body;

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
    roleId,
  });

  await AppDb.getRepository(User).save(user);

  res.status(201).json({ message: "User created successfully." });
});

router.get("/users", auth, validateRole(UserRole.Admin), async (req: Request, res: Response) => {
  const userRepository = AppDb.getRepository(User);
  const users = await userRepository.find({
    select: ["id", "username", "roleId"],
  });

  res.status(200).json({ users });
});

router.put("/users/:userId", auth, validateRole(UserRole.Admin), async (req: Request, res: Response) => {
  const userId = +req.params.userId;
  const { username, roleId } = req.body;

  if (isNaN(userId)) {
    throw new BadRequestError("User id must be number.");
  }

  if (isNullOrEmpty(username)) {
    throw new BadRequestError("Username is empty.");
  }

  const userRepository = AppDb.getRepository(User);

  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new NotFoundError("User don't exists in the system.");
  }

  user.username = username;
  user.roleId = roleId;

  await userRepository.save(user);

  res.status(200).json({ message: "User updated successfully" });
});

router.delete("/users/:userId", auth, validateRole(UserRole.Admin), async (req: Request, res: Response) => {
  const userId = +req.params.userId;

  if (isNaN(userId)) {
    throw new BadRequestError("User id must be number.");
  }

  if (req.currentUser.id === userId) {
    throw new BadRequestError("Cannot delete yourself.");
  }

  const userRepository = AppDb.getRepository(User);

  if (!(await userRepository.exists({ where: { id: userId } }))) {
    throw new NotFoundError("User don't exists in the system.");
  }

  await userRepository.delete({ id: userId });

  res.status(200).json({ message: "User deleted successfully." });
});

export { router as userController };
