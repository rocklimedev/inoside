import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsNumber,
} from 'class-validator';

import { PreferredComm } from '../../common/enums';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  full_name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  // ✅ REPLACED ENUM WITH ROLE ID
  @IsNotEmpty()
  @IsNumber()
  roleId!: number;

  @IsOptional()
  @IsString()
  preferred_comm?: PreferredComm;

  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
