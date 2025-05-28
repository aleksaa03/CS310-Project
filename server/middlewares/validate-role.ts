import { Request, Response, NextFunction } from "express";
import { UserRole } from "../common/enums";

const validateRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req.currentUser.roleId)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
};

export { validateRole };
