import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsNumber,
  ValidateNested,
  IsUrl,
} from 'class-validator';

import { Type } from 'class-transformer';

import { OwnershipStatus } from '@/common/enums';

class UpdateAddressDto {
  @IsOptional()
  @IsString()
  line1?: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsOptional()
  @IsString()
  landmark?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsUrl()
  google_map_link?: string;
}

export class UpdateSiteDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAddressDto)
  address?: UpdateAddressDto;

  @IsOptional()
  @IsEnum(OwnershipStatus)
  ownership_status?: OwnershipStatus;

  @IsOptional()
  @IsBoolean()
  access_available?: boolean;

  @IsOptional()
  @IsBoolean()
  existing_structure?: boolean;
}
