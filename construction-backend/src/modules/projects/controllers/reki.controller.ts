import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

import { RekiReportService } from '../services/reki-report.service';
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class RekiController {
  constructor(private readonly rekiService: RekiReportService) {}

  @Get('reki/all')
  getAll() {
    return this.rekiService.findAll();
  }

  @Get('reki/:id')
  getById(@Param('id') id: string) {
    return this.rekiService.findById(id);
  }

  @Delete('reki/:id')
  delete(@Param('id') id: string) {
    return this.rekiService.delete(id);
  }

  @Patch(':id/reki/done')
  markDone(@Param('id') projectId: string) {
    return this.rekiService.markAsDone(projectId);
  }

  @Patch(':id/reki/pending')
  markPending(@Param('id') projectId: string) {
    return this.rekiService.markAsPending(projectId);
  }

  @Post(':id/reki')
  create(@Param('id') projectId: string, @Body() dto: any) {
    return this.rekiService.create({
      ...dto,
      project_id: projectId,
    });
  }

  @Get(':id/reki')
  get(@Param('id') projectId: string) {
    return this.rekiService.findByProject(projectId);
  }

  @Patch(':id/reki')
  update(@Param('id') projectId: string, @Body() dto: any) {
    return this.rekiService.update(projectId, dto);
  }
}
