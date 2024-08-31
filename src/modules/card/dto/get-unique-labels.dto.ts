import { ApiProperty } from "@nestjs/swagger";

export class GetUniqueLabelsDTO {
  @ApiProperty({ type: [String] })
  labels: string[];
}
