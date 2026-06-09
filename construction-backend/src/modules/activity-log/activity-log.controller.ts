// modules/activity-logs/activity-log.controller.ts

import { Controller, Get, Param, Query, Delete } from '@nestjs/common';

import { ActivityLogService } from './activity-log.service';

@Controller('activity-logs')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  async getLogs(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.activityLogService.getLogs(Number(page), Number(limit));
  }

  @Get('stats')
  async getStats() {
    return this.activityLogService.getStats();
  }

  @Get('recent')
  async getRecent(@Query('limit') limit = 50) {
    return this.activityLogService.getRecent(Number(limit));
  }

  @Get('search')
  async search(
    @Query('userId') userId?: string,
    @Query('moduleName') moduleName?: string,
    @Query('contextTag') contextTag?: string,
    @Query('action') action?: string,
    @Query('severity') severity?: string,
    @Query('referenceId') referenceId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.activityLogService.search({
      userId,
      moduleName,
      contextTag,
      action,
      severity,
      referenceId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get(':activityLogId')
  async getById(
    @Param('activityLogId')
    activityLogId: string,
  ) {
    return this.activityLogService.findById(activityLogId);
  }

  @Get('user/:userId')
  async getByUser(
    @Param('userId') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.activityLogService.findByUserId(
      userId,
      Number(page),
      Number(limit),
    );
  }

  @Get('module/:moduleName')
  async getByModule(
    @Param('moduleName') moduleName: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.activityLogService.findByModule(
      moduleName,
      Number(page),
      Number(limit),
    );
  }

  @Get('severity/:severity')
  async getBySeverity(
    @Param('severity') severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL',
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.activityLogService.findBySeverity(
      severity,
      Number(page),
      Number(limit),
    );
  }

  @Delete(':activityLogId')
  async delete(
    @Param('activityLogId')
    activityLogId: string,
  ) {
    return this.activityLogService.delete(activityLogId);
  }
}
