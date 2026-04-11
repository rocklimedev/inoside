import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MaterialRequestStatus } from './create-material-request.dto';

export class UpdateMaterialRequestStatusDto {
  @IsEnum(MaterialRequestStatus)
  status!: MaterialRequestStatus;

  @IsOptional()
  @IsString()
  remarks?: string;
}
