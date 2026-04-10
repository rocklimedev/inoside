import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import {
  ProjectType,
  ProjectPurpose,
  DesignPreference,
  DecisionReadiness,
  ColorTone,
  LuxuryLevel,
} from '../../common/enums/project.enums';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string; // ← Fixed with ! (definite assignment)

  @IsOptional()
  @IsUUID()
  client_user_id?: string;

  @IsOptional()
  @IsEnum(ProjectType)
  project_type?: ProjectType;

  @IsOptional()
  @IsEnum(ProjectPurpose)
  purpose?: ProjectPurpose;

  @IsOptional()
  @IsNumber()
  num_floors?: number;

  @IsOptional()
  @IsNumber()
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
  is_first_project?: boolean = true;

  @IsOptional()
  @IsEnum(DecisionReadiness)
  decision_readiness?: DecisionReadiness;

  @IsOptional()
  @IsBoolean()
  worked_with_before?: boolean = false;

  @IsOptional()
  @IsBoolean()
  end_to_end?: boolean = true;

  @IsOptional()
  @IsString()
  status?: string = 'brief';

  @IsOptional()
  @IsString()
  current_stage?: string;

  @IsOptional()
  @IsEnum(ColorTone)
  color_tone?: ColorTone;

  @IsOptional()
  @IsEnum(LuxuryLevel)
  luxury_level?: LuxuryLevel;

  @IsOptional()
  @IsNumber()
  func_vs_aesth?: number;

  @IsOptional()
  @IsBoolean()
  budget_flexible?: boolean = true;

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
}
