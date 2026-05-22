import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUUID()
  role_id?: string;

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
