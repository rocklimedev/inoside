import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsBoolean,
  IsString,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateProjectBriefDto {
  @ApiProperty({ description: 'Project ID' })
  @IsUUID()
  project_id!: string;

  @ApiPropertyOptional({ description: 'Rooms and spaces required' })
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

  @ApiPropertyOptional({
    example: 'Ready',
    enum: ['Ready', 'Not Ready', 'Need Discussion'],
  })
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

  @ApiPropertyOptional({ default: 'Pending' })
  @IsOptional()
  @IsString()
  status?: string;
}
