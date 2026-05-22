import { IsString, IsOptional, IsEnum } from 'class-validator';

export type NotificationType = 'message' | 'project' | 'approval' | 'alert';

export type NotificationCategory = 'updates' | 'activity';

export class CreateNotificationDto {
  title!: string;
  message!: string;

  type?: NotificationType;
  category?: NotificationCategory;

  userId?: string;
}
