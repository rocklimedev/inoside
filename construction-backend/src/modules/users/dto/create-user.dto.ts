import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsUUID()
  role_id!: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  // ================= NEW FIELDS =================

  @IsOptional()
  @IsUrl()
  avatar_url?: string;

  @IsOptional()
  @IsUrl()
  avatar_thumbnail?: string;
}
