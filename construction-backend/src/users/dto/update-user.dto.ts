import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
  IsNumber,
} from 'class-validator';

import { PreferredComm } from '@/common/enums';
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  // ✅ REPLACED ENUM WITH ROLE ID
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsString()
  preferred_comm?: PreferredComm;

  @IsOptional()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
