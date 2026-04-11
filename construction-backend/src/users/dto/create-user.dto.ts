import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsNumber,
  IsEnum, // ✅ ADD THIS
} from 'class-validator';
import { Type } from 'class-transformer';
import { PreferredComm } from '../../common/enums'; // ✅ ADD THIS

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  full_name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  roleId!: number;

  // 🔥 FIX STARTS HERE
  @IsOptional()
  @IsEnum(PreferredComm)
  preferred_comm?: PreferredComm;

  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
