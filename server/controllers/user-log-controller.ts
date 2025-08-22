import { Request, Response, Router } from "express";
import { auth } from "../middlewares/auth";
import { validateRole } from "../middlewares/validate-role";
import { UserRole } from "../common/enums";
import AppDb from "../db";
import UserLog from "../models/user-log";
import UserLogSC from "../models/sc/user-log-sc";
import { paginate } from "../utils/pagination";
import { FindOptionsOrder, FindOptionsWhere } from "typeorm";

const router = Router();

router.get(
  "/user-logs",
  auth,
  validateRole(UserRole.Admin),
  async (req: Request<{}, {}, {}, UserLogSC>, res: Response) => {
    const sortColums = ["id", "action", "description", "details", "eventTime", "username", "roleId"];
    const { pageSize, sortExp, sortOrder, skip } = paginate(req.query, sortColums);

    const order: FindOptionsOrder<UserLog> = {};

    if (sortExp) {
      if (sortExp === "username") {
        order.user = { username: sortOrder };
      } else if (sortExp === "roleId") {
        order.user = { roleId: sortOrder };
      } else {
        order[sortExp] = sortOrder;
      }
    }

    const userLogRepository = AppDb.getRepository(UserLog);
    const [userLogs, total] = await userLogRepository.findAndCount({
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
      order,
      skip,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    res.status(200).json({ userLogs, total, totalPages });
  }
);

export { router as userLogController };
