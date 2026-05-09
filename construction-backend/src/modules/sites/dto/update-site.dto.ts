import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';

export class UpdateSiteDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(['Owned', 'Rented', 'Under Process'])
  ownership_status?: 'Owned' | 'Rented' | 'Under Process';

  @IsOptional()
  @IsBoolean()
  access_available?: boolean;

  @IsOptional()
  @IsBoolean()
  existing_structure?: boolean;
}
