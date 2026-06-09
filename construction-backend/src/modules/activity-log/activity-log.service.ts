// modules/activity-logs/activity-log.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, Op, WhereOptions } from 'sequelize';

import { ActivityLog } from './models/activity-log.model';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectModel(ActivityLog)
    private readonly activityLogModel: typeof ActivityLog,
  ) {}

  async create(payload: CreateActivityLogDto): Promise<ActivityLog> {
    return this.activityLogModel.create({
      ...payload,
      isSystemGenerated: payload.isSystemGenerated ?? false,
    } as any);
  }

  async bulkCreate(payloads: CreateActivityLogDto[]): Promise<ActivityLog[]> {
    return this.activityLogModel.bulkCreate(
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

    return this.activityLogModel.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(activityLogId: string): Promise<ActivityLog | null> {
    return this.activityLogModel.findByPk(activityLogId);
  }

  async findByUserId(userId: string, page = 1, limit = 20) {
    return this.activityLogModel.findAndCountAll({
      where: { userId },
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });
  }

  async findByReference(referenceId: string, referenceType?: string) {
    const where: WhereOptions = {
      referenceId,
    };

    if (referenceType) {
      where['referenceType'] = referenceType;
    }

    return this.activityLogModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
  }

  async findByModule(moduleName: string, page = 1, limit = 20) {
    return this.activityLogModel.findAndCountAll({
      where: { moduleName },
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });
  }

  async findByContextTag(contextTag: string, page = 1, limit = 20) {
    return this.activityLogModel.findAndCountAll({
      where: { contextTag },
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });
  }

  async findBySeverity(
    severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL',
    page = 1,
    limit = 20,
  ) {
    return this.activityLogModel.findAndCountAll({
      where: { severity },
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });
  }

  async search(filters: {
    userId?: string;
    moduleName?: string;
    contextTag?: string;
    action?: string;
    severity?: string;
    referenceId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 20 } = filters;

    const where: WhereOptions = {};

    if (filters.userId) where['userId'] = filters.userId;
    if (filters.moduleName) where['moduleName'] = filters.moduleName;
    if (filters.contextTag) where['contextTag'] = filters.contextTag;
    if (filters.action) where['action'] = filters.action;
    if (filters.severity) where['severity'] = filters.severity;
    if (filters.referenceId) where['referenceId'] = filters.referenceId;

    if (filters.startDate || filters.endDate) {
      where['createdAt'] = {};

      if (filters.startDate) {
        where['createdAt'][Op.gte] = filters.startDate;
      }

      if (filters.endDate) {
        where['createdAt'][Op.lte] = filters.endDate;
      }
    }

    return this.activityLogModel.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });
  }

  async getRecent(limit = 50): Promise<ActivityLog[]> {
    return this.activityLogModel.findAll({
      limit,
      order: [['createdAt', 'DESC']],
    });
  }

  async getStats() {
    const totalLogs = await this.activityLogModel.count();

    const [info, warning, error, critical] = await Promise.all([
      this.activityLogModel.count({
        where: { severity: 'INFO' },
      }),
      this.activityLogModel.count({
        where: { severity: 'WARNING' },
      }),
      this.activityLogModel.count({
        where: { severity: 'ERROR' },
      }),
      this.activityLogModel.count({
        where: { severity: 'CRITICAL' },
      }),
    ]);

    return {
      totalLogs,
      info,
      warning,
      error,
      critical,
    };
  }

  async delete(activityLogId: string): Promise<number> {
    return this.activityLogModel.destroy({
      where: {
        activityLogId,
      },
    });
  }

  async deleteOlderThan(days: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.activityLogModel.destroy({
      where: {
        createdAt: {
          [Op.lt]: cutoffDate,
        },
      },
    });
  }
}
