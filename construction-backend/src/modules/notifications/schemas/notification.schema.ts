import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

export type NotificationType = 'message' | 'project' | 'approval' | 'alert';

export type NotificationCategory = 'updates' | 'activity';

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  message!: string;

  @Prop({ default: false })
  unread!: boolean;

  @Prop({ enum: ['message', 'project', 'approval', 'alert'] })
  type!: NotificationType;

  @Prop({ enum: ['updates', 'activity'] })
  category!: NotificationCategory;

  @Prop()
  userId!: string;

  // ✅ FIX HERE
  @Prop({ type: Object })
  meta?: Record<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
