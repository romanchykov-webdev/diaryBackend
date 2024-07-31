import { IsArray, IsBoolean, IsString, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class TodoDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsBoolean()
  completed: boolean;
}

export class CreateCardDTO {
  @ApiProperty({ type: [TodoDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TodoDTO)
  todo: TodoDTO[];

  @ApiProperty({ type: [TodoDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TodoDTO)
  todoCompleted: TodoDTO[];

  @ApiProperty()
  @IsString()
  textarea: string;

  @ApiProperty()
  @IsBoolean()
  isFavorite: boolean;

  @ApiProperty()
  @IsString()
  colors: string;

  @ApiProperty()
  @IsBoolean()
  colorsSwitcher: boolean;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  labels: string[];

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  backgroundColorCard: string;
}
