import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
import { AttachmentsModule } from '../attachments/attachments.module';
import { DailyProgressReport } from './daily-progress/entities/daily-progress.report.entity';
import { StageQualityCheck } from './stage-quality-checks/entities/stage-quality-check.entity';
import { ProjectIssue } from './project-issues/entities/project-issue.entity';
import { Handover } from './handovers/entities/handover.entity';
import { MaterialRequest } from './material-requests/entities/material-reuest.entity';
// Import sub-modules
import { DailyProgressModule } from './daily-progress/daily-progress.module';
import { StageQualityChecksModule } from './stage-quality-checks/stage-quality-checks.module';
import { ProjectIssuesModule } from './project-issues/project-issues.module';
import { HandoversModule } from './handovers/handovers.module';
import { MaterialRequestsModule } from './material-requests/material-requests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DailyProgressReport,
      StageQualityCheck,
      ProjectIssue,
      Handover,
      MaterialRequest,
    ]),
    ProjectsModule,
    UsersModule,
    AttachmentsModule,

    // Sub feature modules
    DailyProgressModule,
    StageQualityChecksModule,
    ProjectIssuesModule,
    HandoversModule,
    MaterialRequestsModule,
  ],
  exports: [
    TypeOrmModule,
    DailyProgressModule,
    StageQualityChecksModule,
    ProjectIssuesModule,
    HandoversModule,
    MaterialRequestsModule,
  ],
})
export class ProjectProgressModule {}
