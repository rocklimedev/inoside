import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyProgressReport } from './entities/daily-progress.report.entity';
import { DailyProgressController } from './daily-progress.controller';
import { DailyProgressService } from './daily-progress.service';
import { ProjectsModule } from '@/projects/projects.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([DailyProgressReport]),
    ProjectsModule, // ✅ THIS FIXES YOUR ERROR
  ],
  controllers: [DailyProgressController],
  providers: [DailyProgressService],
  exports: [DailyProgressService],
})
export class DailyProgressModule {}
