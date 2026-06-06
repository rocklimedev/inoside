// activity-log.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { ActivityLog } from './models/activity-log.model';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectModel(ActivityLog)
    private readonly activityLogModel: typeof ActivityLog,
  ) {}

  async create(payload: CreateActivityLogDto): Promise<ActivityLog> {
    return await this.activityLogModel.create({
      ...payload,
      isSystemGenerated: payload.isSystemGenerated ?? false,
    } as any);
  }

  async bulkCreate(payloads: CreateActivityLogDto[]): Promise<ActivityLog[]> {
    return await this.activityLogModel.bulkCreate(
      payloads.map((payload) => ({
        ...payload,
        isSystemGenerated: payload.isSystemGenerated ?? false,
      })) as any,
    );
  }

  async getLogs(
    page = 1,
    limit = 20,
  ): Promise<{
    count: number;
    rows: ActivityLog[];
  }> {
    const offset = (page - 1) * limit;

    return await this.activityLogModel.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(activityLogId: string): Promise<ActivityLog | null> {
    return await this.activityLogModel.findByPk(activityLogId);
  }

  async delete(activityLogId: string): Promise<number> {
    return await this.activityLogModel.destroy({
      where: {
        activityLogId,
      },
    });
  }
}
