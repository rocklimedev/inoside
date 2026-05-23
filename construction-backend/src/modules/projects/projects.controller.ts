import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import type { Request } from 'express';

import { ProjectsService } from './projects.service';
import { ProjectBriefService } from './services/project-brief.service';
import { PitchReferenceService } from './services/pitch-reference.service';
import { RekiReportService } from './services/reki-report.service';
import { RekiPhotoService } from './services/reki-photo.service';
import { ScopeOfWorkService } from './services/scope-of-work.service';
import { ProjectCostEstimateService } from './services/project-cost-estimate.service';
import { ProjectDrawingService } from './services/project-drawing.service';
import { DrawingApprovalLogService } from './services/drawing-approval-log.service';
import { ProjectPitchService } from './services/project-pitch.service';

// DTOs
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectBriefDto } from './dto/create-project-brief.dto';
import { UpdateProjectBriefDto } from './dto/update-project-brief.dto';
import { RequestBriefChangesDto } from './dto/request-brief-changes.dto';
import { CreateProjectPitchDto } from './dto/create-project-pitch.dto';
import { UpdateProjectPitchDto } from './dto/update-project-pitch.dto';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly briefService: ProjectBriefService,
    private readonly pitchRefService: PitchReferenceService,
    private readonly rekiService: RekiReportService,
    private readonly rekiPhotoService: RekiPhotoService,
    private readonly scopeService: ScopeOfWorkService,
    private readonly costService: ProjectCostEstimateService,
    private readonly drawingService: ProjectDrawingService,
    private readonly approvalLogService: DrawingApprovalLogService,
    private readonly pitchService: ProjectPitchService,
  ) {}

  // =================================================
  // 🧱 PROJECT CORE
  // =================================================

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Patch(':id/progress')
  updateProgress(@Param('id') id: string, @Body('progress') progress: number) {
    return this.projectsService.updateProgress(id, progress);
  }

  // =================================================
  // 📄 BRIEFS (PROJECT SCOPED)
  // =================================================

  @Post(':id/brief')
  createBrief(@Param('id') id: string, @Body() dto: CreateProjectBriefDto) {
    return this.briefService.create({ ...dto, project_id: id });
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
  requestBriefChanges(
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
  sendBriefToClient(@Param('briefId') briefId: string) {
    return this.briefService.sendBriefToClient(briefId);
  }

  @Patch('briefs/:briefId/draft')
  markBriefAsDraft(@Param('briefId') briefId: string) {
    return this.briefService.markBriefAsDraft(briefId);
  }

  // =================================================
  // 🎨 PITCH (PROJECT SCOPED - MAIN)
  // =================================================

  @Post(':id/pitch')
  createPitch(
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
  getPitch(@Param('id') projectId: string) {
    return this.pitchService.getPitch(projectId);
  }

  @Patch(':id/pitch')
  updatePitch(
    @Param('id') projectId: string,
    @Body() dto: UpdateProjectPitchDto,
  ) {
    return this.pitchService.updatePitch(projectId, dto);
  }

  @Delete(':id/pitch')
  deletePitch(@Param('id') projectId: string) {
    return this.pitchService.deleteByProject(projectId);
  }

  // =================================================
  // 📊 PITCH GLOBAL ADMIN ACTIONS
  // =================================================

  @Get('pitches/all')
  getAllPitches() {
    return this.pitchService.getAllPitches();
  }

  @Get('pitches/:pitchId')
  getPitchById(@Param('pitchId') pitchId: string) {
    return this.pitchService.getPitchById(pitchId);
  }

  @Delete('pitches/:pitchId')
  deletePitchById(@Param('pitchId') pitchId: string) {
    return this.pitchService.deletePitch(pitchId);
  }

  @Patch('pitches/:pitchId/approve')
  approvePitch(@Param('pitchId') pitchId: string) {
    return this.pitchService.approvePitch(pitchId);
  }

  @Patch('pitches/:pitchId/reject')
  rejectPitch(@Param('pitchId') pitchId: string) {
    return this.pitchService.rejectPitch(pitchId);
  }

  @Patch('pitches/:pitchId/files')
  replacePitchFile(
    @Param('pitchId') pitchId: string,
    @Body() dto: { pitch_pdf_url?: string; moodboard_pdf_url?: string },
  ) {
    return this.pitchService.replacePitchFile(pitchId, dto);
  }

  // =================================================
  // 💬 PITCH COMMENTS (NEW FULL REST)
  // =================================================

  @Get('pitches/:pitchId/comments')
  getPitchComments(@Param('pitchId') pitchId: string) {
    return this.pitchService.getComments(pitchId);
  }

  @Post('pitches/:pitchId/comments')
  addPitchComment(
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
  updatePitchComment(@Param('commentId') commentId: string, @Body() dto: any) {
    return this.pitchService.updateComment(commentId, dto);
  }

  @Delete('pitches/comments/:commentId')
  deletePitchComment(@Param('commentId') commentId: string) {
    return this.pitchService.deleteComment(commentId);
  }

  // =================================================
  // 🧩 PITCH REFERENCES
  // =================================================

  @Post(':id/pitch-references')
  addPitchReference(@Param('id') projectId: string, @Body() dto: any) {
    return this.pitchRefService.add({ ...dto, project_id: projectId });
  }

  @Get(':id/pitch-references')
  getPitchReferences(@Param('id') projectId: string) {
    return this.pitchRefService.findByProject(projectId);
  }

  @Delete('pitch-references/:refId')
  deletePitchReference(@Param('refId') refId: string) {
    return this.pitchRefService.delete(refId);
  }

  // projects.controller.ts

  // =================================================
  // 🏗️ REKI
  // =================================================
  // =================================================
  // ADD THESE IN projects.controller.ts
  // =================================================

  @Get('reki/all')
  getAllRekiReports() {
    return this.rekiService.findAll();
  }

  @Get('reki/:id')
  getRekiById(@Param('id') id: string) {
    return this.rekiService.findById(id);
  }

  @Delete('reki/:id')
  deleteReki(@Param('id') id: string) {
    return this.rekiService.delete(id);
  }

  @Patch(':id/reki/done')
  markRekiAsDone(@Param('id') projectId: string) {
    return this.rekiService.markAsDone(projectId);
  }

  @Patch(':id/reki/pending')
  markRekiAsPending(@Param('id') projectId: string) {
    return this.rekiService.markAsPending(projectId);
  }
  @Post(':id/reki')
  createReki(@Param('id') projectId: string, @Body() dto: any) {
    return this.rekiService.create({ ...dto, project_id: projectId });
  }

  @Get(':id/reki')
  getReki(@Param('id') projectId: string) {
    return this.rekiService.findByProject(projectId);
  }

  @Patch(':id/reki')
  updateReki(@Param('id') projectId: string, @Body() dto: any) {
    return this.rekiService.update(projectId, dto); // ← Fixed: Use projectId, not 'id'
  }

  // =================================================
  // 📸 REKI PHOTOS (Better Implementation)
  // =================================================

  @Post(':id/reki/photos')
  async addRekiPhoto(@Param('id') projectId: string, @Body() dto: any) {
    return this.rekiPhotoService.add({
      ...dto,
      project_id: projectId,
      reki_report_id: dto.reki_report_id,
    });
  }

  @Delete('reki/photos/:photoId')
  deleteRekiPhoto(@Param('photoId') photoId: string) {
    return this.rekiPhotoService.delete(photoId);
  }
  // =================================================
  // 📐 SCOPE OF WORK
  // =================================================

  @Post(':id/scope')
  createScope(@Param('id') projectId: string, @Body() dto: any) {
    return this.scopeService.create({ ...dto, project_id: projectId });
  }

  @Get(':id/scope')
  getScope(@Param('id') projectId: string) {
    return this.scopeService.findByProject(projectId);
  }

  @Patch(':id/scope')
  updateScope(@Param('id') id: string, @Body() dto: any) {
    return this.scopeService.update(id, dto);
  }

  // =================================================
  // 💰 COST ESTIMATES
  // =================================================

  @Post(':id/cost-estimates')
  addCostEstimate(@Param('id') projectId: string, @Body() dto: any) {
    return this.costService.add({ ...dto, project_id: projectId });
  }

  @Get(':id/cost-estimates')
  getCostEstimates(@Param('id') projectId: string) {
    return this.costService.findByProject(projectId);
  }

  @Patch('cost-estimates/:estimateId')
  updateCostEstimate(
    @Param('estimateId') estimateId: string,
    @Body() dto: any,
  ) {
    return this.costService.update(estimateId, dto);
  }

  @Delete('cost-estimates/:estimateId')
  deleteCostEstimate(@Param('estimateId') estimateId: string) {
    return this.costService.delete(estimateId);
  }

  // =================================================
  // 🧾 DRAWINGS
  // =================================================

  @Post(':id/drawings')
  uploadDrawing(@Param('id') projectId: string, @Body() dto: any) {
    return this.drawingService.upload({ ...dto, project_id: projectId });
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

  // =================================================
  // 📊 DRAWING APPROVAL LOGS
  // =================================================

  @Post('drawings/:drawingId/logs')
  addApprovalLog(@Param('drawingId') drawingId: string, @Body() dto: any) {
    return this.approvalLogService.create({
      ...dto,
      drawing_id: drawingId,
    });
  }

  @Get('drawings/:drawingId/logs')
  getApprovalLogs(@Param('drawingId') drawingId: string) {
    return this.approvalLogService.findByDrawing(drawingId);
  }
}
