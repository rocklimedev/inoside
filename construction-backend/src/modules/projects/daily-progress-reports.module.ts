import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyProgressReport } from './models/daily-progress-report.model';
import { DailyProgressReportsService } from './services/daily-progress-reports.service';
import { DailyProgressReportsController } from './controllers/daily-progress-reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DailyProgressReport])],
  controllers: [DailyProgressReportsController],
  providers: [DailyProgressReportsService],
  exports: [DailyProgressReportsService],
})
export class DailyProgressReportsModule {}
