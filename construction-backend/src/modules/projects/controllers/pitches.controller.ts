import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

import { ProjectPitchService } from '../services/project-pitch.service';

import { CreateProjectPitchDto } from '../dto/create-project-pitch.dto';
import { UpdateProjectPitchDto } from '../dto/update-project-pitch.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class PitchesController {
  constructor(private readonly pitchService: ProjectPitchService) {}

  @Post(':id/pitch')
  create(
    @Param('id') projectId: string,
    @Body() dto: CreateProjectPitchDto,
    @Req() req: Request,
  ) {
    return this.pitchService.createPitch(projectId, {
      ...dto,
      created_by: (req.user as any).id,
    });
  }

  @Get(':id/pitch')
  get(@Param('id') projectId: string) {
    return this.pitchService.getPitch(projectId);
  }

  @Patch(':id/pitch')
  update(@Param('id') projectId: string, @Body() dto: UpdateProjectPitchDto) {
    return this.pitchService.updatePitch(projectId, dto);
  }

  @Delete(':id/pitch')
  remove(@Param('id') projectId: string) {
    return this.pitchService.deleteByProject(projectId);
  }

  @Get('pitches/all')
  getAll() {
    return this.pitchService.getAllPitches();
  }

  @Get('pitches/:pitchId')
  getById(@Param('pitchId') pitchId: string) {
    return this.pitchService.getPitchById(pitchId);
  }

  @Delete('pitches/:pitchId')
  deleteById(@Param('pitchId') pitchId: string) {
    return this.pitchService.deletePitch(pitchId);
  }

  @Patch('pitches/:pitchId/approve')
  approve(@Param('pitchId') pitchId: string) {
    return this.pitchService.approvePitch(pitchId);
  }

  @Patch('pitches/:pitchId/reject')
  reject(@Param('pitchId') pitchId: string) {
    return this.pitchService.rejectPitch(pitchId);
  }
}
