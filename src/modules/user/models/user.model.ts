import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table
export class User extends Model {
  @Column
  userName: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column
  language: string;

  @Column
  themeModeDevice: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true
  })
  popupForNewUser: boolean;

  @Column
  avatar: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true
  })
  colors: string[];

  @Column
  switcherFolder: string;
}
