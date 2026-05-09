import { IsNotEmpty, IsArray, IsUUID } from 'class-validator';

export class AssignPermissionsDto {
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  permission_ids!: string[];
}
