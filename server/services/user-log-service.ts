import { UserLogType } from "../common/enums";
import AppDb from "../db";
import NotFoundError from "../errors/not-found-error";
import User from "../models/user";
import UserLog from "../models/user-log";

const addUserLog = async (userId: number, action: UserLogType, description: string, details: string) => {
  try {
    const user = await AppDb.getRepository(User).findOne({ where: { id: userId } });

    if (user === null) {
      throw new NotFoundError("User don't exists in the system.");
    }

    const userLog = AppDb.getRepository(UserLog).create({
      user,
      action,
      description,
      details,
    });

    await AppDb.getRepository(UserLog).save(userLog);
  } catch (error) {
    console.error("Error adding user log:", error);
  }
};

export { addUserLog };
