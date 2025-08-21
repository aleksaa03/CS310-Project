import { Entity, Column, OneToMany } from "typeorm";
import Base from "./base";
import { UserRole } from "../common/enums";
import Watchlist from "./watch-list";
import Comment from "./comment";
import UserLog from "./user-log";

@Entity({ name: "users" })
export default class User extends Base {
  @Column({ name: "username", type: "varchar", length: 100, unique: true })
  public username: string;

  @Column({ name: "password", type: "varchar", length: 256 })
  public password: string;

  @Column({ name: "role_id", type: "smallint" })
  public roleId: UserRole;

  @OneToMany(() => Watchlist, (watchlist) => watchlist.user)
  public watchlist: Watchlist[];

  @OneToMany(() => Comment, (comment) => comment.user)
  public comments: Comment[];

  @OneToMany(() => UserLog, (userLog) => userLog.user)
  public userLogs: UserLog[];
}
