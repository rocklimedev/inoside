import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMaterialDto {
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  category?: string;
}
