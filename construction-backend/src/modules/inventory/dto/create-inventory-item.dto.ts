import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateInventoryItemDto {
  @IsNotEmpty()
  item_code!: string;

  @IsNotEmpty()
  item_name!: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  unit_id?: string;

  @IsOptional()
  default_rate?: number;

  @IsOptional()
  brand?: string;

  @IsOptional()
  specification?: string;
}
