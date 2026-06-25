import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

import { PitchReferenceService } from './services/pitch-reference.service';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class PitchReferencesController {
  constructor(private readonly pitchRefService: PitchReferenceService) {}

  @Post(':id/pitch-references')
  addReference(@Param('id') projectId: string, @Body() dto: any) {
    return this.pitchRefService.add({
      ...dto,
      project_id: projectId,
    });
  }

  @Get(':id/pitch-references')
  getReferences(@Param('id') projectId: string) {
    return this.pitchRefService.findByProject(projectId);
  }

  @Delete('pitch-references/:refId')
  deleteReference(@Param('refId') refId: string) {
    return this.pitchRefService.delete(refId);
  }
}
