import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum OwnershipStatus {
  OWNED = 'Owned',
  RENTED = 'Rented',
  UNDER_PROCESS = 'Under Process',
}

export class CreateSiteDto {
  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsOptional()
  @IsEnum(OwnershipStatus)
  ownership_status?: OwnershipStatus;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  access_available?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  existing_structure?: boolean;
}
