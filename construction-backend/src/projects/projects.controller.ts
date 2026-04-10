import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProjectProposalsService } from './project-proposals.service';
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly proposalsService: ProjectProposalsService, // ✅ ADD THIS
  ) {}
  // CREATE PROJECT
  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.ARCHITECT)
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    const project = await this.projectsService.create(
      createProjectDto,
      req.user.id, // Pass authenticated user ID as client
    );

    return {
      success: true,
      message: 'Project created successfully',
      data: project,
    };
  }

  // GET ALL PROJECTS
  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.ARCHITECT)
  async findAll(@Query('status') status?: string) {
    let projects;

    if (status) {
      projects = await this.projectsService.findByStatus(status);
    } else {
      projects = await this.projectsService.findAll();
    }

    return {
      success: true,
      count: projects.length,
      data: projects,
    };
  }

  // GET MY PROJECTS (For Clients)
  @Get('my-projects')
  @Roles(UserRole.CLIENT)
  async getMyProjects(@Request() req) {
    const projects = await this.projectsService.findByClient(req.user.id);
    return {
      success: true,
      count: projects.length,
      data: projects,
    };
  }

  // GET SINGLE PROJECT
  @Get(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPERVISOR,
    UserRole.ARCHITECT,
    UserRole.CLIENT,
  )
  async findOne(@Param('id') id: string, @Request() req) {
    const project = await this.projectsService.findOne(id);

    // Clients can only view their own projects
    if (
      req.user.role === UserRole.CLIENT &&
      project.client_user_id !== req.user.id
    ) {
      throw new Error('Access denied to this project'); // Better to use ForbiddenException
    }

    return {
      success: true,
      data: project,
    };
  }

  // UPDATE PROJECT
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.ARCHITECT)
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const project = await this.projectsService.update(id, updateProjectDto);
    return {
      success: true,
      message: 'Project updated successfully',
      data: project,
    };
  }

  // UPDATE COMPLETION
  @Patch(':id/completion')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  async updateCompletion(
    @Param('id') id: string,
    @Body('completion') completion: number,
  ) {
    const project = await this.projectsService.updateCompletion(id, completion);
    return {
      success: true,
      message: 'Project completion updated',
      data: project,
    };
  }

  // DELETE PROJECT
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.projectsService.softDelete(id);
    return {
      success: true,
      message: 'Project deleted successfully',
    };
  }
  @Post(':id/proposal')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.ARCHITECT)
  async createOrUpdateProposal(
    @Param('id') project_id: string,
    @Body() dto,
    @Request() req,
  ) {
    const proposal = await this.proposalsService.create(
      {
        ...dto,
        project_id,
      },
      req.user.id,
    );

    return {
      success: true,
      message: 'Proposal created successfully',
      data: proposal,
    };
  }

  @Get(':id/proposal')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPERVISOR,
    UserRole.ARCHITECT,
    UserRole.CLIENT,
  )
  async getProposal(@Param('id') project_id: string, @Request() req) {
    const project = await this.projectsService.findOne(project_id);

    // 🔐 Client restriction
    if (
      req.user.role === UserRole.CLIENT &&
      project.client_user_id !== req.user.id
    ) {
      throw new ForbiddenException('Access denied to this project');
    }

    const proposal = await this.proposalsService.findByProject(project_id);

    return {
      success: true,
      data: proposal,
    };
  }

  @Patch(':id/proposal')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.ARCHITECT)
  async updateProposal(@Param('id') project_id: string, @Body() body) {
    const existing = await this.proposalsService.findByProject(project_id);

    if (!existing) {
      throw new NotFoundException('Proposal not found');
    }

    const updated = await this.proposalsService.update(existing.id, body);

    return {
      success: true,
      message: 'Proposal updated successfully',
      data: updated,
    };
  }

  @Patch(':id/proposal/sign-client')
  @Roles(UserRole.CLIENT)
  async signByClient(@Param('id') project_id: string, @Request() req) {
    const project = await this.projectsService.findOne(project_id);

    if (project.client_user_id !== req.user.id) {
      throw new ForbiddenException('Not your project');
    }

    const proposal = await this.proposalsService.findByProject(project_id);

    const updated = await this.proposalsService.update(proposal.id, {
      signed_by_client: true,
    });

    return {
      success: true,
      message: 'Proposal signed by client',
      data: updated,
    };
  }

  @Patch(':id/proposal/sign-builder')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  async signByBuilder(@Param('id') project_id: string) {
    const proposal = await this.proposalsService.findByProject(project_id);

    const updated = await this.proposalsService.update(proposal.id, {
      signed_by_builder: true,
    });

    return {
      success: true,
      message: 'Proposal signed by builder',
      data: updated,
    };
  }
  // STATS
  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  async getStats() {
    const stats = await this.projectsService.getProjectsStats();
    return {
      success: true,
      data: stats,
    };
  }
}
