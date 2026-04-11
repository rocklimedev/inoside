import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MaxLength(50)
  name!: string;

  @IsString()
  @MaxLength(100)
  display_name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
