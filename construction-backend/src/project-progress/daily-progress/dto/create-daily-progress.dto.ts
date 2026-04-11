import {
  IsUUID,
  IsDateString,
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDailyProgressReportDto {
  @IsUUID()
  project_id!: string;

  @IsDateString()
  report_date!: string;

  @IsOptional()
  @IsString()
  current_stage?: string;

  @IsOptional()
  @IsString()
  work_executed?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  manpower_count?: number;

  @IsOptional()
  @IsObject()
  materials_used?: Record<string, any>;

  @IsOptional()
  @IsString()
  issues_faced?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  completion_percent_today?: number;

  @IsOptional()
  @IsUUID()
  created_by?: string;
}
