import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

import { RekiPhotoService } from '../services/reki-photo.service';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class RekiPhotosController {
  constructor(private readonly rekiPhotoService: RekiPhotoService) {}

  @Post(':id/reki/photos')
  addPhoto(@Param('id') projectId: string, @Body() dto: any) {
    return this.rekiPhotoService.add({
      ...dto,
      project_id: projectId,
      reki_report_id: dto.reki_report_id,
    });
  }

  @Delete('reki/photos/:photoId')
  deletePhoto(@Param('photoId') photoId: string) {
    return this.rekiPhotoService.delete(photoId);
  }
}
