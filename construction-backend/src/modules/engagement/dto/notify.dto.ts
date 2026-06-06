import {
  NotificationCategory,
  NotificationType,
} from '@/modules/notifications/schemas/notification.schema';

export class NotifyDto {
  recipientUserId!: string;

  title!: string;

  message!: string;

  type!: NotificationType;

  category!: NotificationCategory;

  meta?: Record<string, any>;
}
