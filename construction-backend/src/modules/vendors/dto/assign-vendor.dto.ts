import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class AssignVendorDto {
  @IsNotEmpty()
  @IsUUID()
  project_id!: string;

  @IsNotEmpty()
  @IsUUID()
  vendor_id!: string;

  @IsOptional()
  @IsBoolean()
  selected?: boolean;

  @IsOptional()
  @IsString()
  selection_reason?: string;

  @IsOptional()
  @IsNumber()
  approved_estimate_value?: number;

  @IsOptional()
  @IsString()
  scope_summary?: string;

  @IsOptional()
  @IsString()
  final_estimate_url?: string;
}
