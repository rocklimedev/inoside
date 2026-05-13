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

  @IsNotEmpty()
  @IsUUID()
  section_id!: string;

  @IsOptional()
  @IsUUID()
  subheading_id?: string;

  @IsOptional()
  @IsUUID()
  inventory_item_id?: string;

  @IsOptional()
  @IsUUID()
  unit_id?: string;

  // ================= BASIC INFO =================

  @IsOptional()
  @IsString()
  sno?: string;

  @IsOptional()
  @IsString()
  item_code?: string;

  @IsOptional()
  @IsString()
  item_name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  specification?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  // ================= VALUES =================

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
  wastage_percent?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discount_percent?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  tax_percent?: number;

  // ================= OTHER =================

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sort_order?: number;
}