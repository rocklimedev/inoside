import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';

import { PreferredCommunication } from '@/common/enums';
export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  contact_number!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
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
