// dto/assign-vendor.dto.ts

import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
  IsUUID,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

class VendorTypeDto {
  @IsUUID()
  type_id!: string;
}

export class AssignVendorDto {
  @IsNotEmpty()
  @IsUUID()
  project_id!: string;

  @IsNotEmpty()
  @IsUUID()
  vendor_id!: string;

  @IsOptional()
  @IsBoolean()
  selected?: boolean;

  @IsOptional()
  @IsString()
  selection_reason?: string;

  @IsOptional()
  @IsNumber()
  approved_estimate_value?: number;

  @IsOptional()
  @IsString()
  scope_summary?: string;

  @IsOptional()
  @IsString()
  final_estimate_url?: string;

  // Optional vendor type mapping
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VendorTypeDto)
  vendor_types?: VendorTypeDto[];
}
