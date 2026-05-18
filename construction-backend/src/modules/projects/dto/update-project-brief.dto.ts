import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateProjectBriefDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  rooms_spaces_required?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  parking_required?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  first_construction_project?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  decision_readiness?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  end_to_end_services?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  output_client_profile?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  output_project_profile?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  // Approval fields should usually not be updated directly via DTO
  // (handled by dedicated service methods like approveBrief, requestBriefChanges, etc.)
}
