import { Request, Response, Router } from "express";
import { auth } from "../middlewares/auth";
import { validateRole } from "../middlewares/validate-role";
import { UserRole } from "../common/enums";
import AppDb from "../db";
import UserLog from "../models/user-log";

const router = Router();

router.get("/user-logs", auth, validateRole(UserRole.Admin), async (req: Request, res: Response) => {
  const userLogRepository = AppDb.getRepository(UserLog);
  const userLogs = await userLogRepository.find({
    select: {
      id: true,
      action: true,
      description: true,
      details: true,
      eventTime: true,
      user: {
        username: true,
        roleId: true,
      },
    },
    relations: ["user"],
    order: { eventTime: "DESC" },
  });

  res.status(200).json({ userLogs });
});

export { router as userLogController };
