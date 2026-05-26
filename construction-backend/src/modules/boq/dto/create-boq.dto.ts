import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateBoqDto {
  @IsOptional()
  @IsUUID()
  project_id?: string | null;

  @IsOptional()
  @IsUUID()
  client_id?: string | null;

  @IsNotEmpty()
  @IsUUID()
  boq_category_id!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  prepared_by?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  revision_no?: string;
}
