import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

import { ProjectDrawingService } from '../services/project-drawing.service';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class DrawingsController {
  constructor(private readonly drawingService: ProjectDrawingService) {}

  @Post(':id/drawings')
  uploadDrawing(@Param('id') projectId: string, @Body() dto: any) {
    return this.drawingService.upload({
      ...dto,
      project_id: projectId,
    });
  }

  @Get(':id/drawings')
  getDrawings(@Param('id') projectId: string) {
    return this.drawingService.findByProject(projectId);
  }

  @Patch('drawings/:drawingId/approve')
  approveDrawing(
    @Param('drawingId') drawingId: string,
    @Body('user_id') userId: string,
  ) {
    return this.drawingService.approve(drawingId, userId);
  }

  @Delete('drawings/:drawingId')
  deleteDrawing(@Param('drawingId') drawingId: string) {
    return this.drawingService.delete(drawingId);
  }
}
