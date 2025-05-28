import { PrimaryGeneratedColumn } from "typeorm";

export default abstract class Base {
  @PrimaryGeneratedColumn({ name: "id" })
  public id: number;
}
