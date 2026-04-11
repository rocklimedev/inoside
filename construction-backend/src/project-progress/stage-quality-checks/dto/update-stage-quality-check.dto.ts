import { PartialType } from '@nestjs/mapped-types';
import { CreateStageQualityCheckDto } from './create-stage-quality-check.dto';

export class UpdateStageQualityCheckDto extends PartialType(
  CreateStageQualityCheckDto,
) {}
