import { ActivityLogService } from '../activity-log/activity-log.service';
import { NotificationsService } from '../notifications/service/notifications.service';
import { AuditDto } from './dto/audit.dto';
import { NotifyDto } from './dto/notify.dto';
import { AuditAndNotifyDto } from './dto/audit-notify.dto';
export declare class EngagementService {
    private readonly activityLogService;
    private readonly notificationsService;
    constructor(activityLogService: ActivityLogService, notificationsService: NotificationsService);
    audit(payload: AuditDto): Promise<import("../activity-log/models/activity-log.model").ActivityLog>;
    notify(payload: NotifyDto): Promise<import("mongoose").Document<unknown, {}, import("../notifications/schemas/notification.schema").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("../notifications/schemas/notification.schema").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    auditAndNotify(payload: AuditAndNotifyDto): Promise<{
        audit: import("../activity-log/models/activity-log.model").ActivityLog;
        notification: import("mongoose").Document<unknown, {}, import("../notifications/schemas/notification.schema").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("../notifications/schemas/notification.schema").Notification & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
