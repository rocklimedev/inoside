// dto/create-project-proposal.dto.ts
import {
  IsEnum,
  IsUUID,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { ProposalTypeEnum } from '../entities/project-proposal.entity';

export class CreateProjectProposalDto {
  @IsUUID()
  project_id!: string;

  @IsEnum(ProposalTypeEnum)
  proposal_type!: ProposalTypeEnum;

  @IsOptional()
  @IsString()
  scope_summary?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  buyer_name?: string;

  @IsOptional()
  @IsBoolean()
  signed_by_client?: boolean;

  @IsOptional()
  @IsBoolean()
  signed_by_builder?: boolean;
}
