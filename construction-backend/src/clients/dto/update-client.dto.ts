import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { CreateClientDto } from './create-client.dto';
import { PartialType } from '@nestjs/swagger';
export class UpdateClientDto extends PartialType(CreateClientDto) {} // You'll need to import PartialType
