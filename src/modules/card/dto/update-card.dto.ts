import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { TodoDTO } from "./create-card.dto";

export class UpdateCardDTO {
  @ApiProperty({ type: [TodoDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TodoDTO)
  @IsOptional()
  todo?: TodoDTO[];

  @ApiProperty({ type: [TodoDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TodoDTO)
  @IsOptional()
  todoCompleted?: TodoDTO[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  textarea?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  typeCard?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  colors?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  colorsSwitcher?: boolean;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  labels?: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  backgroundColorCard?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  order?: number;
}
