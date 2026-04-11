import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PreferredCommunication {
  CALL = 'Call',
  WHATSAPP = 'WhatsApp',
  EMAIL = 'Email',
}

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  contact_number!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(PreferredCommunication)
  preferred_communication?: PreferredCommunication;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_owner?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  representative_involved?: boolean;

  @IsOptional()
  @IsString()
  representative_comment?: string;
}
