import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

import { ProjectBriefService } from './services/project-brief.service';

import { CreateProjectBriefDto } from './dto/create-project-brief.dto';
import { UpdateProjectBriefDto } from './dto/update-project-brief.dto';
import { RequestBriefChangesDto } from './dto/request-brief-changes.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class BriefsController {
  constructor(private readonly briefService: ProjectBriefService) {}

  @Post(':id/brief')
  createBrief(@Param('id') id: string, @Body() dto: CreateProjectBriefDto) {
    return this.briefService.create({
      ...dto,
      project_id: id,
    });
  }

  @Get(':id/brief')
  getBrief(@Param('id') id: string) {
    return this.briefService.getBrief(id);
  }

  @Patch(':id/brief')
  updateBrief(@Param('id') id: string, @Body() dto: UpdateProjectBriefDto) {
    return this.briefService.updateBrief(id, dto);
  }

  @Get('briefs/all')
  getAllBriefs() {
    return this.briefService.getAllBriefs();
  }

  @Patch('briefs/:briefId/approve')
  approveBrief(@Param('briefId') briefId: string, @Req() req: Request) {
    return this.briefService.approveBrief(briefId, (req.user as any).id);
  }

  @Patch('briefs/:briefId/unapprove')
  unapproveBrief(@Param('briefId') briefId: string) {
    return this.briefService.unapproveBrief(briefId);
  }

  @Patch('briefs/:briefId/request-changes')
  requestChanges(
    @Param('briefId') briefId: string,
    @Body() dto: RequestBriefChangesDto,
    @Req() req: Request,
  ) {
    return this.briefService.requestBriefChanges(briefId, {
      note: dto.note,
      requested_by: (req.user as any).id,
    });
  }

  @Patch('briefs/:briefId/send-to-client')
  sendToClient(@Param('briefId') briefId: string) {
    return this.briefService.sendBriefToClient(briefId);
  }

  @Patch('briefs/:briefId/draft')
  markDraft(@Param('briefId') briefId: string) {
    return this.briefService.markBriefAsDraft(briefId);
  }
}
