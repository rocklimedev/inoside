import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBoqSubHeadingDto {
  @IsNotEmpty()
  @IsUUID()
  section_id!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  section_order?: number;
}
