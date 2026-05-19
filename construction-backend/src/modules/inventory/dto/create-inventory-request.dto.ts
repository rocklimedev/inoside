import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateInventoryRequestDto {
  @IsNotEmpty()
  project_id!: string;

  @IsOptional()
  material_id?: string;

  @IsNotEmpty()
  quantity_required!: number;

  @IsOptional()
  required_date?: string;

  @IsOptional()
  vendor_id?: string;

  @IsNotEmpty()
  source_type!: 'Vendor' | 'Warehouse';

  @IsOptional()
  requested_by?: string;
}
