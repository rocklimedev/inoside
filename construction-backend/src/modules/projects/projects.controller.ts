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

  // ================= CREATE =================

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'project_manager')
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  // ================= READ ALL =================

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  // ================= READ ONE =================

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  // ================= UPDATE =================

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'project_manager')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  // ================= PROGRESS =================

  @Patch(':id/progress')
  updateProgress(@Param('id') id: string, @Body('progress') progress: number) {
    return this.projectsService.updateProgress(id, progress);
  }

  // ================= DELETE =================

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
