import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateBoqItemDto {
  @IsNotEmpty()
  @IsUUID()
  boq_id!: string;

  // ❌ REMOVE section_id (no longer needed)

  @IsNotEmpty()
  @IsUUID()
  subheading_id!: string; // ✅ NEW REQUIRED FIELD

  @IsOptional()
  @IsUUID()
  unit_id?: string;

  @IsOptional()
  @IsString()
  sno?: string;

  @IsNotEmpty()
  @IsString()
  item_name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  qty?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rate?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sort_order?: number;
}
