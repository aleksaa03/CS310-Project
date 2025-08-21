import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Base from "./base";
import User from "./user";
import { UserLogType } from "../common/enums";

@Entity({ name: "user_logs" })
export default class UserLog extends Base {
  @Column({ name: "action", type: "smallint" })
  public action: UserLogType;

  @Column({ name: "description", type: "text", nullable: true })
  public description?: string;

  @Column({ name: "details", type: "text", nullable: true })
  public details?: string;

  @Column({ name: "event_time", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  public eventTime: Date;

  @Column({ name: "user_id", type: "int" })
  public userId: number;

  @ManyToOne(() => User, (user) => user.userLogs, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  public user: User;
}
