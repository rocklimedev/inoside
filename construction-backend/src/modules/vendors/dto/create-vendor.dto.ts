// dto/create-vendor.dto.ts

import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsInt,
  IsDateString,
  IsObject,
  IsMobilePhone,
} from 'class-validator';

export class CreateVendorDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsMobilePhone()
  mobile_number!: string;

  @IsOptional()
  @IsUUID()
  brand_company_id?: string;

  @IsOptional()
  @IsString()
  company_name?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  type_of_business?: string;

  @IsOptional()
  @IsString()
  optional_mobile?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  area_covered?: string;

  @IsOptional()
  @IsBoolean()
  is_architect?: boolean;

  @IsOptional()
  @IsBoolean()
  is_interior?: boolean;

  @IsOptional()
  @IsBoolean()
  is_furniture?: boolean;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsString()
  reference_name?: string;

  @IsOptional()
  @IsString()
  reference_mobile?: string;

  @IsOptional()
  @IsObject()
  address?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsUUID()
  created_by?: string;

  @IsOptional()
  @IsUUID()
  updated_by?: string;

  // Many-to-many vendor types
  @IsOptional()
  type_ids?: string[];
}
