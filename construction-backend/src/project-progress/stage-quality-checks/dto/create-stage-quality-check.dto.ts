import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStageQualityCheckDto {
  @IsUUID()
  project_id!: string;

  @IsString()
  @IsNotEmpty()
  stage_name!: string;

  @IsBoolean()
  @Type(() => Boolean)
  quality_met!: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  deviations!: boolean;

  @IsOptional()
  @IsString()
  corrective_action?: string;

  @IsOptional()
  @IsString()
  supervisor_remarks?: string;

  @IsOptional()
  @IsUUID()
  checked_by?: string;
}
