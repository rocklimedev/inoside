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
import { ProjectIssuesService } from './project-issues.service';
import { CreateProjectIssueDto } from './dto/create-project-issue.dto';
import { UpdateProjectIssueDto } from './dto/update-project-issue.dto';
import { UpdateIssueStatusDto } from './dto/update-issue-status.dto';
// import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
// import { RolesGuard } from '../../common/guards/roles.guard';
// import { Roles } from '../../common/decorators/roles.decorator';

@Controller('projects/:projectId/issues')
export class ProjectIssuesController {
  constructor(private readonly issuesService: ProjectIssuesService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('SUPERVISOR', 'PROJECT_MANAGER', 'SITE_ENGINEER')
  async create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateProjectIssueDto,
  ) {
    dto.project_id = projectId;
    return this.issuesService.create(dto);
  }

  @Get()
  async findAll(@Param('projectId') projectId: string) {
    return this.issuesService.findAllByProject(projectId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.issuesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProjectIssueDto,
  ) {
    return this.issuesService.update(id, updateDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() statusDto: UpdateIssueStatusDto,
  ) {
    return this.issuesService.updateStatus(id, statusDto);
  }

  @Patch(':id/after-photo')
  async addAfterPhoto(
    @Param('id') id: string,
    @Body('after_photo_id') afterPhotoId: string,
  ) {
    return this.issuesService.addAfterPhoto(id, afterPhotoId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.issuesService.remove(id);
  }
}
