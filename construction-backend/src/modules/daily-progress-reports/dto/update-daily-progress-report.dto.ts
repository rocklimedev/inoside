import { PartialType } from '@nestjs/mapped-types';
import { CreateDailyProgressReportDto } from './create-daily-progress-report.dto';

export class UpdateDailyProgressReportDto extends PartialType(
  CreateDailyProgressReportDto,
) {}
