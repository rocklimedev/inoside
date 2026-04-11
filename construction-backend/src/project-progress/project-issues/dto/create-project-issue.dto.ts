import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';

export enum IssueStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
}

export class CreateProjectIssueDto {
  @IsUUID()
  project_id!: string;

  @IsString()
  @IsNotEmpty()
  issue_description!: string;

  @IsString()
  @IsNotEmpty()
  responsible_party!: string;

  @IsOptional()
  @IsDateString()
  target_resolution_date?: string;

  @IsOptional()
  @IsEnum(IssueStatus)
  status?: IssueStatus;

  @IsOptional()
  @IsUUID()
  before_photo_id?: string;

  @IsOptional()
  @IsUUID()
  after_photo_id?: string;
}
