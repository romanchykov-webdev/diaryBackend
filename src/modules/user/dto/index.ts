import { IsArray, IsBoolean, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDTO {
  @ApiProperty() //это декоратор из модуля @nestjs/swagger, который используется для добавления метаданных к свойствам класса. Эти метаданные затем используются для автоматической генерации OpenAPI (Swagger) документации вашего API.
  @IsString()
  userName: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsString()
  themeModeDevice: string;

  @ApiProperty()
  @IsBoolean()
  popupForNewUser: boolean;

  @ApiProperty()
  @IsString()
  avatar: string;

  @ApiProperty()
  @IsString()
  switcherFolder: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  colors: string[];
}

export class UpdateUserDTO {
  @ApiProperty()
  @IsString()
  userName: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsString()
  themeModeDevice: string;

  @ApiProperty()
  @IsBoolean()
  popupForNewUser: boolean;

  @ApiProperty()
  @IsString()
  avatar: string;

  @ApiProperty()
  @IsString()
  switcherFolder: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  colors: string[];
}

export class UpdatePasswordDTO {
  @ApiProperty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  newPassword: string;
}
