import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum MaterialRequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  ORDERED = 'Ordered',
  RECEIVED = 'Received',
  CANCELLED = 'Cancelled',
}

export class CreateMaterialRequestDto {
  @IsOptional()
  @IsUUID()
  project_id?: string;

  @IsString()
  @IsNotEmpty()
  material_name!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  quantity_required!: number;

  @IsString()
  @IsNotEmpty()
  unit!: string;

  @IsOptional()
  @IsDateString()
  required_by_date?: string;

  @IsOptional()
  @IsUUID()
  requested_by?: string;

  @IsOptional()
  @IsEnum(MaterialRequestStatus)
  status?: MaterialRequestStatus;
}
