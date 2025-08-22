import { Request, Response, Router } from "express";
import AppDb from "../db";
import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflict-error";
import NotFoundError from "../errors/not-found-error";
import { isNullOrEmpty } from "../utils/string";
import { auth } from "../middlewares/auth";
import { validateRole } from "../middlewares/validate-role";
import { UserLogType, UserRole } from "../common/enums";
import User from "../models/user";
import bcrypt from "bcrypt";
import { addUserLog } from "../services/user-log-service";
import UserSC from "../models/sc/user-sc";
import { paginate } from "../utils/pagination";

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

  await addUserLog(
    req.currentUser.id,
    UserLogType.Add,
    `Created user with ID ${user.id}`,
    `User: ${user.id}, ${user.username}`
  );
});

router.get("/users", auth, validateRole(UserRole.Admin), async (req: Request<{}, {}, {}, UserSC>, res: Response) => {
  const sortColums = ["id", "username", "roleId"];
  const { pageSize, sortExp, sortOrder, skip } = paginate(req.query, sortColums);

  const userRepository = AppDb.getRepository(User);
  const [users, total] = await userRepository.findAndCount({
    select: { id: true, username: true, roleId: true },
    order: { [sortExp]: sortOrder },
    skip,
    take: pageSize,
  });

  const totalPages = Math.ceil(total / pageSize);

  res.status(200).json({ users, total, totalPages });
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

  const lastUsernameValue = user.username;
  const lastRoleIdValue = user.roleId;

  user.username = username;
  user.roleId = roleId;

  await userRepository.save(user);

  res.status(200).json({ message: "User updated successfully" });

  await addUserLog(
    req.currentUser.id,
    UserLogType.Update,
    `Updated user with ID ${user.id}`,
    `User: ${user.id}, ${lastUsernameValue} -> ${username}, ${lastRoleIdValue} -> ${roleId}`
  );
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

  await addUserLog(req.currentUser.id, UserLogType.Delete, `Deleted user with ID ${userId}`, `User ID: ${userId}`);
});

export { router as userController };
