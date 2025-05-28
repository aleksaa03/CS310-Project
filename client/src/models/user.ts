import { UserRole } from "../common/enums";

export default interface IUser {
  id: number;
  username: string;
  roleId: UserRole;
}
