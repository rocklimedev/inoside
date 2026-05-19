import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUUID,
  IsBoolean,
} from 'class-validator';

import {
  ProjectType,
  ServiceType,
  PurposeType,
  TimelineExpectation,
} from '@/common/enums';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsUUID()
  client_id!: string;

  @IsOptional()
  @IsUUID()
  site_id?: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEnum(ProjectType)
  project_type!: ProjectType;

  @IsOptional()
  @IsEnum(ServiceType)
  service_type?: ServiceType;

  @IsOptional()
  @IsEnum(PurposeType)
  purpose?: PurposeType;

  @IsOptional()
  @IsNumber()
  number_of_floors?: number;

  @IsOptional()
  @IsNumber()
  approximate_area_sqft?: number;

  @IsOptional()
  @IsString()
  budget_range?: string;

  @IsOptional()
  @IsEnum(TimelineExpectation)
  timeline_expectation?: TimelineExpectation;

  @IsOptional()
  @IsString()
  design_preference?: string;

  // ✅ ADD THESE (they exist in model)

  @IsOptional()
  @IsString()
  current_stage?: string;

  @IsOptional()
  @IsBoolean()
  token_received?: boolean;

  @IsOptional()
  @IsUUID()
  created_by?: string;
}
