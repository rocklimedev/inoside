import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class RequestBriefChangesDto {
  @ApiProperty({ description: 'Reason for requesting changes' })
  @IsString()
  @IsOptional()
  note?: string;
}
