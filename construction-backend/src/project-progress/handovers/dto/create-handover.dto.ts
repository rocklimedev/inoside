import {
  IsUUID,
  IsDateString,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsObject,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHandoverDto {
  @IsUUID()
  project_id!: string;

  @IsOptional()
  @IsDateString()
  handover_date?: string;

  @IsOptional()
  @IsObject()
  planned_vs_actual_timeline?: Record<string, any>;

  @IsOptional()
  @IsString()
  scope_summary?: string;

  @IsOptional()
  @IsBoolean()
  completion_confirmation?: boolean;

  @IsOptional()
  @IsString()
  outstanding_items?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  warranty_months?: number;

  @IsOptional()
  @IsString()
  maintenance_notes?: string;

  @IsOptional()
  @IsUUID()
  handover_pdf_id?: string;

  @IsOptional()
  @IsUUID()
  drawings_zip_id?: string;
}
