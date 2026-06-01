// dto/update-boq-status.dto.ts

import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class UpdateBoqStatusDto {
  @IsEnum(['draft', 'submitted', 'approved', 'rejected', 'revised'])
  status!: 'draft' | 'submitted' | 'approved' | 'rejected' | 'revised';

  @IsOptional()
  @IsUUID()
  approved_by?: string;
}
