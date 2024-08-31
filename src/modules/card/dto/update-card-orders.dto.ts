import { IsArray, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCardOrderDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNumber()
  order: number;
}

export class UpdateCardOrdersDTO {
  @ApiProperty({ type: [UpdateCardOrderDTO] })
  @IsArray()
  orders: UpdateCardOrderDTO[];
}
