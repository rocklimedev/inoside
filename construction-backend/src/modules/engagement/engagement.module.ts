import { Module } from '@nestjs/common';

import { ActivityLogModule } from '../activity-log/activity-log.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';

import { EngagementService } from './engagement.service';
import { AuthEngagementService } from './services/auth-engagement.service';
import { ClientEngagementService } from './services/client-engagement.service';
import { CdnEngagementService } from './services/cdn-engagement.service';
import { RbacEngagementService } from './services/rbac-engagement.service';
import { SiteEngagementService } from './services/site-engagement.service';
import { TaskEngagementService } from './services/task-engagement.service';
import { UserEngagementService } from './services/user-engagement.service';
import { VendorEngagementService } from './services/vendor-engagement.service';
@Module({
  imports: [ActivityLogModule, NotificationsModule],

  providers: [
    EngagementService,
    AuthEngagementService,
    ClientEngagementService,
    CdnEngagementService,
    RbacEngagementService,
    SiteEngagementService,
    TaskEngagementService,
    UserEngagementService,
    VendorEngagementService,
  ],

  exports: [
    EngagementService,
    AuthEngagementService,
    ClientEngagementService,
    CdnEngagementService,
    SiteEngagementService,
    TaskEngagementService,
    UserEngagementService,
    VendorEngagementService,
    RbacEngagementService,
  ],
})
export class EngagementModule {}
