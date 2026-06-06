// activity-log.module.ts

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ActivityLog } from './models/activity-log.model';
import { ActivityLogService } from './activity-log.service';

@Module({
  imports: [SequelizeModule.forFeature([ActivityLog])],

  providers: [ActivityLogService],

  exports: [ActivityLogService],
})
export class ActivityLogModule {}
