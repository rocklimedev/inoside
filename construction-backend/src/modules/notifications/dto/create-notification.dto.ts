import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export type NotificationType = 'message' | 'project' | 'approval' | 'alert';

export type NotificationCategory = 'updates' | 'activity';

export class CreateNotificationDto {
  @IsString()
  title!: string;

  @IsString()
  message!: string;

  @IsOptional()
  type?: NotificationType;

  @IsOptional()
  category?: NotificationCategory;

  @IsOptional()
  userId?: string;

  @IsOptional()
  @IsBoolean()
  unread?: boolean;

  @IsOptional()
  @IsObject()
  meta?: Record<string, any>;
}
