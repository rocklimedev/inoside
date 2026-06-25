import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DrawingsController } from './drawings.controller';

import { ProjectDrawingService } from './services/project-drawing.service';
import { DrawingApprovalLogService } from './services/drawing-approval-log.service';

import { ProjectDrawing } from './models/project-drawings.model';
import { DrawingApprovalLog } from './models/drawing_approval_logs.model';
import { Project } from '../projects/models/project.model';
import { User } from '@/modules/users/models/user.model';
import { CdnModule } from '@/modules/cdn/cdn.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProjectDrawing,
      DrawingApprovalLog,
      Project,
      User,
    ]),
    CdnModule,
  ],

  controllers: [DrawingsController],

  providers: [ProjectDrawingService, DrawingApprovalLogService],

  exports: [ProjectDrawingService],
})
export class DrawingsModule {}
