import { Column, Model, Table } from 'sequelize-typescript';

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

  @Column
  avatar: string;
}
