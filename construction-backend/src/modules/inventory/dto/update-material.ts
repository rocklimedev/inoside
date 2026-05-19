import { IsOptional } from 'class-validator';

export class UpdateMaterialDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  category?: string;
}
