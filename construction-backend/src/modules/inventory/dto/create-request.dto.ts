import { IsNotEmpty, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreateRequestDto {
  @IsNotEmpty()
  project_id!: string;

  @IsNotEmpty()
  material_id!: string;

  @IsNumber()
  quantity_required!: number;

  @IsEnum(['Vendor', 'Warehouse'])
  source_type!: 'Vendor' | 'Warehouse';

  @IsOptional()
  vendor_id?: string;
}
