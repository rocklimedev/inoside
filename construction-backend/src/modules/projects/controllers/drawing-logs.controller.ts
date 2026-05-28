import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

import { DrawingApprovalLogService } from '../services/drawing-approval-log.service';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class DrawingLogsController {
  constructor(private readonly approvalLogService: DrawingApprovalLogService) {}

  @Post('drawings/:drawingId/logs')
  addLog(@Param('drawingId') drawingId: string, @Body() dto: any) {
    return this.approvalLogService.create({
      ...dto,
      drawing_id: drawingId,
    });
  }

  @Get('drawings/:drawingId/logs')
  getLogs(@Param('drawingId') drawingId: string) {
    return this.approvalLogService.findByDrawing(drawingId);
  }
}
