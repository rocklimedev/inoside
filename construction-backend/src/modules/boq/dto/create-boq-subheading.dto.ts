import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateBoqSubHeadingDto {
  @IsNotEmpty()
  @IsUUID()
  boq_id!: string;

  @IsNotEmpty()
  @IsUUID()
  section_id!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sort_order?: number;
}