import {
  IsOptional,
  IsString,
  IsEmail,
  IsBoolean,
  IsEnum,
} from 'class-validator';

import { PreferredCommunication } from '@/common/enums';
export class UpdateClientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  contact_number?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(PreferredCommunication)
  preferred_communication?: PreferredCommunication;

  @IsOptional()
  @IsBoolean()
  representative_involved?: boolean;

  @IsOptional()
  @IsString()
  representative_comment?: string;
}
