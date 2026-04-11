import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IssueStatus } from './create-project-issue.dto';

export class UpdateIssueStatusDto {
  @IsEnum(IssueStatus)
  status!: IssueStatus;

  @IsOptional()
  @IsString()
  remarks?: string; // optional remarks when closing
}
