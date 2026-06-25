import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateDailyProgressReportDto {
  @IsString()
  project_id!: string;

  @IsDateString()
  report_date!: string;

  @IsOptional()
  @IsString()
  supervisor_id?: string;

  @IsOptional()
  @IsString()
  current_stage?: string;

  @IsOptional()
  @IsString()
  work_executed?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  manpower_count?: number;

  @IsOptional()
  @IsString()
  materials_used?: string;

  @IsOptional()
  @IsString()
  issues_faced?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  progress_photos?: string[];
}
