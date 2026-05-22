import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../schemas/notification.schema';
import { CreateNotificationDto } from '../dto/create-notification.dto';
@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}
  async create(dto: CreateNotificationDto) {
    const notification = {
      title: dto.title,
      message: dto.message,
      type: dto.type,
      category: dto.category,
      userId: dto.userId,
      unread: true,
    };

    return this.notificationModel.create(notification);
  }

  async findAll(userId: string) {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findUnreadCount(userId: string) {
    return this.notificationModel.countDocuments({
      userId,
      unread: true,
    });
  }

  async markAsRead(id: string) {
    const updated = await this.notificationModel.findByIdAndUpdate(
      id,
      { unread: false },
      { new: true },
    );

    if (!updated) throw new NotFoundException('Notification not found');

    return updated;
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany(
      { userId, unread: true },
      { unread: false },
    );
  }

  async delete(id: string) {
    return this.notificationModel.findByIdAndDelete(id);
  }
}
