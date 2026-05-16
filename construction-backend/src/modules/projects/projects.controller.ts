import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // =================================================
  // 🧱 CORE PROJECT CRUD
  // =================================================

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'project_manager')
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
  @UseGuards(RolesGuard)
  @Roles('admin', 'project_manager')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
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
  createBrief(@Param('id') id: string, @Body() dto: any) {
    return this.projectsService.createBrief({
      ...dto,
      project_id: id,
    });
  }

  @Get(':id/brief')
  getBrief(@Param('id') id: string) {
    return this.projectsService.getBrief(id);
  }

  @Patch(':id/brief')
  updateBrief(@Param('id') id: string, @Body() dto: any) {
    return this.projectsService.updateBrief(id, dto);
  }
  // =================================================
  // 🧠 GET ALL BRIEFS
  // =================================================

  @Get('briefs/all')
  getAllBriefs() {
    return this.projectsService.getAllBriefs();
  }
  // =================================================
  // 🧠 GET BRIEF BY BRIEF ID
  // =================================================

  @Get('briefs/:briefId')
  getBriefById(@Param('briefId') briefId: string) {
    return this.projectsService.getBriefById(briefId);
  }
  // =================================================
  // 🎨 PROJECT PITCH
  // =================================================

  @Post(':id/pitch')
  createPitch(@Param('id') id: string, @Body() dto: any) {
    return this.projectsService.createPitch({
      ...dto,
      project_id: id,
    });
  }

  @Get(':id/pitch')
  getPitch(@Param('id') id: string) {
    return this.projectsService.getPitch(id);
  }

  @Patch(':id/pitch')
  updatePitch(@Param('id') id: string, @Body() dto: any) {
    return this.projectsService.updatePitch(id, dto);
  }

  // =================================================
  // 🧩 PITCH REFERENCES
  // =================================================

  @Post(':id/pitch-references')
  addPitchReference(@Param('id') id: string, @Body() dto: any) {
    return this.projectsService.addPitchReference({
      ...dto,
      project_id: id,
    });
  }

  @Get(':id/pitch-references')
  getPitchReferences(@Param('id') id: string) {
    return this.projectsService.getPitchReferences(id);
  }

  @Delete('pitch-references/:refId')
  deletePitchReference(@Param('refId') refId: string) {
    return this.projectsService.deletePitchReference(refId);
  }

  // =================================================
  // 🏗️ REKI REPORT
  // =================================================

  @Post(':id/reki')
  createReki(@Param('id') id: string, @Body() dto: any) {
    return this.projectsService.createReki({
      ...dto,
      project_id: id,
    });
  }

  @Get(':id/reki')
  getReki(@Param('id') id: string) {
    return this.projectsService.getReki(id);
  }

  @Patch(':id/reki')
  updateReki(@Param('id') id: string, @Body() dto: any) {
    return this.projectsService.updateReki(id, dto);
  }

  // =================================================
  // 📸 REKI PHOTOS
  // =================================================

  @Post(':id/reki/photos')
  addRekiPhoto(@Param('id') id: string, @Body() dto: any) {
    return this.projectsService.addRekiPhoto({
      ...dto,
      project_id: id,
    });
  }

  @Get('reki/:rekiId/photos')
  getRekiPhotos(@Param('rekiId') rekiId: string) {
    return this.projectsService.getRekiPhotos(rekiId);
  }

  @Delete('reki/photos/:photoId')
  deleteRekiPhoto(@Param('photoId') photoId: string) {
    return this.projectsService.deleteRekiPhoto(photoId);
  }

  // =================================================
  // 📐 SCOPE OF WORK
  // =================================================

  @Post(':id/scope')
  createScope(@Param('id') id: string, @Body() dto: any) {
    return this.projectsService.createScope({
      ...dto,
      project_id: id,
    });
  }

  @Get(':id/scope')
  getScope(@Param('id') id: string) {
    return this.projectsService.getScope(id);
  }

  @Patch(':id/scope')
  updateScope(@Param('id') id: string, @Body() dto: any) {
    return this.projectsService.updateScope(id, dto);
  }

  // =================================================
  // 💰 COST ESTIMATES
  // =================================================

  @Post(':id/cost-estimates')
  addCostEstimate(@Param('id') id: string, @Body() dto: any) {
    return this.projectsService.addCostEstimate({
      ...dto,
      project_id: id,
    });
  }

  @Get(':id/cost-estimates')
  getCostEstimates(@Param('id') id: string) {
    return this.projectsService.getCostEstimates(id);
  }

  @Patch('cost-estimates/:estimateId')
  updateCostEstimate(
    @Param('estimateId') estimateId: string,
    @Body() dto: any,
  ) {
    return this.projectsService.updateCostEstimate(estimateId, dto);
  }

  // =================================================
  // 🧾 DRAWINGS
  // =================================================

  @Post(':id/drawings')
  uploadDrawing(@Param('id') id: string, @Body() dto: any) {
    return this.projectsService.uploadDrawing({
      ...dto,
      project_id: id,
    });
  }

  @Get(':id/drawings')
  getDrawings(@Param('id') id: string) {
    return this.projectsService.getDrawings(id);
  }

  @Patch('drawings/:drawingId/approve')
  approveDrawing(
    @Param('drawingId') drawingId: string,
    @Body('user_id') user_id: string,
  ) {
    return this.projectsService.approveDrawing(drawingId, user_id);
  }

  // =================================================
  // 📊 APPROVAL LOGS
  // =================================================

  @Post('drawings/:drawingId/logs')
  addApprovalLog(@Param('drawingId') drawingId: string, @Body() dto: any) {
    return this.projectsService.addApprovalLog({
      ...dto,
      drawing_id: drawingId,
    });
  }

  @Get('drawings/:drawingId/logs')
  getApprovalLogs(@Param('drawingId') drawingId: string) {
    return this.projectsService.getApprovalLogs(drawingId);
  }
}
