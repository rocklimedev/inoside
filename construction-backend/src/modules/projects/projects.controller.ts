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
  // 📊 GLOBAL PITCH MANAGEMENT
  // IMPORTANT:
  // KEEP STATIC ROUTES ABOVE ":id"
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
  deletePitch(@Param('pitchId') pitchId: string) {
    return this.pitchService.deletePitch(pitchId);
  }

  @Post('pitches/:pitchId/comments')
  addPitchComment(
    @Param('pitchId') pitchId: string,
    @Body('content') content: string,
    @Req() req: Request,
  ) {
    const user = req.user as any;

    return this.pitchService.addComment(pitchId, {
      content,
      user_id: user.id,
    });
  }

  @Patch('pitches/:pitchId/files')
  replacePitchFile(
    @Param('pitchId') pitchId: string,
    @Body()
    dto: {
      pitch_pdf_url?: string;
      moodboard_pdf_url?: string;
    },
  ) {
    return this.pitchService.replacePitchFile(pitchId, dto);
  }

  @Patch('pitches/:pitchId/approve')
  approvePitch(@Param('pitchId') pitchId: string) {
    return this.pitchService.approvePitch(pitchId);
  }

  @Patch('pitches/:pitchId/reject')
  rejectPitch(@Param('pitchId') pitchId: string) {
    return this.pitchService.rejectPitch(pitchId);
  }

  // =================================================
  // 📄 BRIEFS STATIC ROUTES
  // =================================================

  @Get('briefs/all')
  getAllBriefs() {
    return this.briefService.getAllBriefs();
  }

  @Get('briefs/:briefId')
  getBriefById(@Param('briefId') briefId: string) {
    return this.briefService.getBriefById(briefId);
  }

  @Patch('briefs/:briefId/approve')
  approveBrief(@Param('briefId') briefId: string, @Req() req: Request) {
    const user = req.user as any;
    return this.briefService.approveBrief(briefId, user.id);
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
    const user = req.user as any;

    return this.briefService.requestBriefChanges(briefId, {
      note: dto.note,
      requested_by: user.id,
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
  // 🧱 CORE PROJECT CRUD
  // KEEP ":id" ROUTES BELOW STATIC ROUTES
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
  // 📄 PROJECT BRIEF
  // =================================================

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

  // =================================================
  // 🎨 PROJECT PITCH
  // =================================================

  @Post(':id/pitch')
  createPitch(
    @Param('id') id: string,
    @Body() dto: CreateProjectPitchDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;

    return this.pitchService.createPitch(id, {
      ...dto,
      created_by: user.id,
    });
  }

  @Get(':id/pitch')
  getPitch(@Param('id') id: string) {
    return this.pitchService.getPitch(id);
  }

  @Patch(':id/pitch')
  updatePitch(@Param('id') id: string, @Body() dto: UpdateProjectPitchDto) {
    return this.pitchService.updatePitch(id, dto);
  }

  // =================================================
  // 🧩 PITCH REFERENCES
  // =================================================

  @Post(':id/pitch-references')
  addPitchReference(@Param('id') id: string, @Body() dto: any) {
    return this.pitchRefService.add({
      ...dto,
      project_id: id,
    });
  }

  @Get(':id/pitch-references')
  getPitchReferences(@Param('id') id: string) {
    return this.pitchRefService.findByProject(id);
  }

  @Delete('pitch-references/:refId')
  deletePitchReference(@Param('refId') refId: string) {
    return this.pitchRefService.delete(refId);
  }

  // =================================================
  // 🏗️ REKI REPORT
  // =================================================

  @Post(':id/reki')
  createReki(@Param('id') id: string, @Body() dto: any) {
    return this.rekiService.create({
      ...dto,
      project_id: id,
    });
  }

  @Get(':id/reki')
  getReki(@Param('id') id: string) {
    return this.rekiService.findOne(id);
  }

  @Patch(':id/reki')
  updateReki(@Param('id') id: string, @Body() dto: any) {
    return this.rekiService.update(id, dto);
  }

  // =================================================
  // 📸 REKI PHOTOS
  // =================================================

  @Post(':id/reki/photos')
  addRekiPhoto(@Param('id') id: string, @Body() dto: any) {
    return this.rekiPhotoService.add({
      ...dto,
      project_id: id,
    });
  }

  @Get('reki/:rekiId/photos')
  getRekiPhotos(@Param('rekiId') rekiId: string) {
    return this.rekiPhotoService.findByReki(rekiId);
  }

  @Delete('reki/photos/:photoId')
  deleteRekiPhoto(@Param('photoId') photoId: string) {
    return this.rekiPhotoService.delete(photoId);
  }

  // =================================================
  // 📐 SCOPE OF WORK
  // =================================================

  @Post(':id/scope')
  createScope(@Param('id') id: string, @Body() dto: any) {
    return this.scopeService.create({
      ...dto,
      project_id: id,
    });
  }

  @Get(':id/scope')
  getScope(@Param('id') id: string) {
    return this.scopeService.findOne(id);
  }

  @Patch(':id/scope')
  updateScope(@Param('id') id: string, @Body() dto: any) {
    return this.scopeService.update(id, dto);
  }

  // =================================================
  // 💰 COST ESTIMATES
  // =================================================

  @Post(':id/cost-estimates')
  addCostEstimate(@Param('id') id: string, @Body() dto: any) {
    return this.costService.add({
      ...dto,
      project_id: id,
    });
  }

  @Get(':id/cost-estimates')
  getCostEstimates(@Param('id') id: string) {
    return this.costService.findByProject(id);
  }

  @Patch('cost-estimates/:estimateId')
  updateCostEstimate(
    @Param('estimateId') estimateId: string,
    @Body() dto: any,
  ) {
    return this.costService.update(estimateId, dto);
  }

  // =================================================
  // 🧾 DRAWINGS
  // =================================================

  @Post(':id/drawings')
  uploadDrawing(@Param('id') id: string, @Body() dto: any) {
    return this.drawingService.upload({
      ...dto,
      project_id: id,
    });
  }

  @Get(':id/drawings')
  getDrawings(@Param('id') id: string) {
    return this.drawingService.findByProject(id);
  }

  @Patch('drawings/:drawingId/approve')
  approveDrawing(
    @Param('drawingId') drawingId: string,
    @Body('user_id') user_id: string,
  ) {
    return this.drawingService.approve(drawingId, user_id);
  }

  // =================================================
  // 📊 APPROVAL LOGS
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
