import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import {
  ProjectType,
  ProjectPurpose,
  DesignPreference,
  DecisionReadiness,
  ColorTone,
  LuxuryLevel,
} from '../../common/enums/project.enums';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(ProjectType)
  project_type?: ProjectType;

  @IsOptional()
  @IsEnum(ProjectPurpose)
  purpose?: ProjectPurpose;

  @IsOptional()
  @IsNumber()
  @Min(1)
  num_floors?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  approx_area?: number;

  @IsOptional()
  @IsString()
  budget_range?: string;

  @IsOptional()
  @IsString()
  timeline_expectation?: string;

  @IsOptional()
  @IsEnum(DesignPreference)
  design_preference?: DesignPreference;

  @IsOptional()
  @IsBoolean()
  is_first_project?: boolean;

  @IsOptional()
  @IsEnum(DecisionReadiness)
  decision_readiness?: DecisionReadiness;

  @IsOptional()
  @IsBoolean()
  worked_with_before?: boolean;

  @IsOptional()
  @IsBoolean()
  end_to_end?: boolean;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  current_stage?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  overall_completion?: number;

  @IsOptional()
  @IsString()
  preferred_style?: string;

  @IsOptional()
  @IsEnum(ColorTone)
  color_tone?: ColorTone;

  @IsOptional()
  @IsEnum(LuxuryLevel)
  luxury_level?: LuxuryLevel;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  func_vs_aesth?: number;

  @IsOptional()
  @IsBoolean()
  budget_flexible?: boolean;

  @IsOptional()
  priority_areas?: any; // JSONB

  @IsOptional()
  @IsString()
  likes_dislikes?: string;

  @IsOptional()
  @IsString()
  non_negotiables?: string;

  @IsOptional()
  @IsString()
  special_req?: string;

  @IsOptional()
  @IsUUID()
  primary_site_address_id?: string;

  @IsOptional()
  @IsUUID()
  client_user_id?: string;
}
