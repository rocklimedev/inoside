import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

import { ProjectDrawingService } from '../services/project-drawing.service';
import { CdnService } from '@/modules/cdn/services/cdn.service';

@Controller('drawings')
@UseGuards(JwtAuthGuard)
export class DrawingsController {
  constructor(
    private readonly drawingService: ProjectDrawingService,
    private readonly cdnService: CdnService,
  ) {}

  @Post(':projectId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDrawing(
    @Param('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    if (!file) {
      throw new BadRequestException('PDF file is required');
    }

    const uploaded = await this.cdnService.uploadFile(file);

    return this.drawingService.upload({
      project_id: projectId,
      drawing_type: body.drawing_type,
      version: Number(body.version),
      area_floor: body.area_floor,
      file_url: uploaded.url,
      approved: false,
    });
  }

  @Get()
  getAllDrawings() {
    return this.drawingService.findAll();
  }

  @Get('project/:projectId')
  getDrawings(@Param('projectId') projectId: string) {
    return this.drawingService.findByProject(projectId);
  }

  @Patch(':drawingId/approve')
  approveDrawing(
    @Param('drawingId') drawingId: string,
    @Body('user_id') userId: string,
  ) {
    return this.drawingService.approve(drawingId, userId);
  }

  @Delete(':drawingId')
  deleteDrawing(@Param('drawingId') drawingId: string) {
    return this.drawingService.delete(drawingId);
  }
}
