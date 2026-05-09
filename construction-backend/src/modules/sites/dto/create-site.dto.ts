import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';

import { OwnershipStatus } from '@/common/enums';

export class CreateSiteDto {
  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

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
