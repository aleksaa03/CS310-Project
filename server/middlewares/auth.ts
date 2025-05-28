import { NextFunction, Request, Response } from "express";
import { isNullOrEmpty } from "../utils/string";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../common/constants";
import { UserRole } from "../common/enums";
import NotAuthorizedError from "../errors/not-authorized-error";

type UserPayload = {
  id: number;
  username: string;
  roleId: UserRole;
};

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (isNullOrEmpty(token)) {
    res.clearCookie("token");
    throw new NotAuthorizedError("Not authorized");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.currentUser = decoded as UserPayload;
    next();
  } catch (error) {
    res.clearCookie("token");
    throw new NotAuthorizedError("Not authorized");
  }
};

export { auth };
