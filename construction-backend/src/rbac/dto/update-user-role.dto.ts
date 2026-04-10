import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsNumber()
  roleId!: number; // Now using Role ID instead of enum
}
