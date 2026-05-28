import {
  Controller,
  Get,
  Post,
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

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class PitchCommentsController {
  constructor(private readonly pitchService: ProjectPitchService) {}

  @Get('pitches/:pitchId/comments')
  getComments(@Param('pitchId') pitchId: string) {
    return this.pitchService.getComments(pitchId);
  }

  @Post('pitches/:pitchId/comments')
  addComment(
    @Param('pitchId') pitchId: string,
    @Body('content') content: string,
    @Req() req: Request,
  ) {
    return this.pitchService.addComment(pitchId, {
      content,
      user_id: (req.user as any).id,
    });
  }

  @Patch('pitches/comments/:commentId')
  updateComment(@Param('commentId') commentId: string, @Body() dto: any) {
    return this.pitchService.updateComment(commentId, dto);
  }

  @Delete('pitches/comments/:commentId')
  deleteComment(@Param('commentId') commentId: string) {
    return this.pitchService.deleteComment(commentId);
  }
}
