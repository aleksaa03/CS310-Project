import { UserLogType, UserRole } from "../common/enums";

export default interface IUserLog {
  id: number;
  action: UserLogType;
  description: string;
  details: string;
  eventTime: Date;
  user: {
    username: string;
    roleId: UserRole;
  };
}
