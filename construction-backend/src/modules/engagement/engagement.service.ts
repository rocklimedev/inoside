import { Injectable } from '@nestjs/common';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { NotificationsService } from '../notifications/service/notifications.service';
import { AuditDto } from './dto/audit.dto';
import { NotifyDto } from './dto/notify.dto';
import { AuditAndNotifyDto } from './dto/audit-notify.dto';
import { ActivitySeverity } from '@/common/enums';

@Injectable()
export class EngagementService {
  constructor(
    private readonly activityLogService: ActivityLogService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async audit(payload: AuditDto) {
    return this.activityLogService.create({
      userId: payload.actor?.userId,
      userName: payload.actor?.userName,

      contextTag: payload.contextTag,
      action: payload.action,

      severity: payload.severity ?? ActivitySeverity.INFO,

      title: payload.title,

      description: payload.description,

      moduleName: payload.moduleName,

      referenceId: payload.referenceId,

      referenceType: payload.referenceType,

      metadata: payload.metadata,

      oldValues: payload.oldValues,

      newValues: payload.newValues,
    });
  }

  async notify(payload: NotifyDto) {
    return this.notificationsService.create({
      userId: payload.recipientUserId,

      title: payload.title,

      message: payload.message,

      unread: true,

      type: payload.type,

      category: payload.category,

      meta: payload.meta,
    });
  }

  async auditAndNotify(payload: AuditAndNotifyDto) {
    const audit = await this.audit(payload.audit);

    const notification = await this.notify(payload.notification);

    return {
      audit,
      notification,
    };
  }
}
