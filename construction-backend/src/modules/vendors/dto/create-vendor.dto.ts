import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateVendorDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  trade_type?: string;

  @IsOptional()
  @IsString()
  contact_details?: string;
}
