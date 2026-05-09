import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsUUID,
} from 'class-validator';

import {
  ProjectType,
  ServiceType,
  PurposeType,
  TimelineExpectation,
} from '@/common/enums';

export class UpdateProjectDto {
  @IsOptional()
  @IsUUID()
  client_id?: string;

  @IsOptional()
  @IsUUID()
  site_id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(ProjectType)
  project_type?: ProjectType;

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

  @IsOptional()
  @IsNumber()
  progress_percentage?: number;

  @IsOptional()
  @IsUUID()
  created_by?: string;
}
