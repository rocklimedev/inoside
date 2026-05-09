import { IsOptional, IsString } from 'class-validator';

export class UpdateVendorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  trade_type?: string;

  @IsOptional()
  @IsString()
  contact_details?: string;
}
