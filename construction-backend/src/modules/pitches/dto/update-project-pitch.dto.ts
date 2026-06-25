import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsObject,
} from 'class-validator';

export class UpdateProjectPitchDto {
  @ApiPropertyOptional({ example: 'Modern Minimalist' })
  @IsOptional()
  @IsString()
  preferred_design_style?: string;

  @ApiPropertyOptional({ enum: ['Light', 'Dark', 'Mixed', 'Not Sure'] })
  @IsOptional()
  @IsEnum(['Light', 'Dark', 'Mixed', 'Not Sure'])
  color_tone?: 'Light' | 'Dark' | 'Mixed' | 'Not Sure';

  @ApiPropertyOptional({ enum: ['Low', 'Medium', 'High'] })
  @IsOptional()
  @IsEnum(['Low', 'Medium', 'High'])
  luxury_level?: 'Low' | 'Medium' | 'High';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  functional_vs_aesthetic?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  budget_flexibility?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  priority_areas?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  likes_dislikes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  non_negotiables?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  special_requirements?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  moodboard_pdf_url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pitch_pdf_url?: string;
}
