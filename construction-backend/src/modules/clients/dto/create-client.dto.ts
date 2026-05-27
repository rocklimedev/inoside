import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { PreferredCommunication } from '@/common/enums';
export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  contact_number?: string;
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEmail()
  email?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(PreferredCommunication)
  preferred_communication?: PreferredCommunication;
  @IsOptional()
  @IsBoolean()
  is_owner?: boolean;

  @IsOptional()
  @IsBoolean()
  representative_involved?: boolean;

  @IsOptional()
  @IsString()
  representative_comment?: string;
}
