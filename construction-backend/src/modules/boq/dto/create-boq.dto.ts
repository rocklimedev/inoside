import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateBoqDto {
  @IsNotEmpty()
  @IsUUID()
  project_id!: string;

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
}
