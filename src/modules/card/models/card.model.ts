import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "../../user/models/user.model"; // Импортировать модель User напрямую из файла модели

interface Todo {
  id: string;
  content: string;
  completed: boolean;
}

@Table
export class Card extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column({
    type: DataType.ARRAY(DataType.JSON),
  })
  todo: Todo[];

  @Column({
    type: DataType.ARRAY(DataType.JSON),
  })
  todoCompleted: Todo[];

  @Column
  textarea: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isFavorite: boolean;

  @Column
  colors: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  colorsSwitcher: boolean;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  labels: string[];

  @Column
  title: string;

  @Column
  backgroundColorCard: string;

  @Column
  order: number;
}
