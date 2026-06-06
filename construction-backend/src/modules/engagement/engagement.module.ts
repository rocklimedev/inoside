import { Module } from '@nestjs/common';

import { ActivityLogModule } from '../activity-log/activity-log.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';

import { EngagementService } from './engagement.service';
import { AuthEngagementService } from './services/auth-engagement.service';
import { ClientEngagementService } from './services/client-engagement.service';
@Module({
  imports: [ActivityLogModule, NotificationsModule],

  providers: [
    EngagementService,
    AuthEngagementService,
    ClientEngagementService,
  ],

  exports: [EngagementService, AuthEngagementService, ClientEngagementService],
})
export class EngagementModule {}
