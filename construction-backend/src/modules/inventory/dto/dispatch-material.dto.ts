import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DispatchMaterialDto {
  @IsNotEmpty()
  request_id!: string;

  @IsNumber()
  dispatch_quantity!: number;

  @IsOptional()
  @IsString()
  vehicle_challan?: string;
}
