import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { BoqService } from './boq.service';
import { CreateBoqVersionDto } from './dto/create-boq-version.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';

@Controller('boq')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BoqController {
  constructor(
    private readonly boqService: BoqService,
    private readonly projectsService: ProjectsService, // For ownership checks
  ) {}

  // ========================================
  // CREATE NEW BOQ VERSION
  // ========================================
  @Post(':projectId')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.ARCHITECT)
  async create(
    @Param('projectId') projectId: string,
    @Body() createBoqDto: CreateBoqVersionDto,
    @Request() req,
  ) {
    // Verify project exists
    const project = await this.projectsService.findOne(projectId);

    const boq = await this.boqService.create(
      projectId,
      createBoqDto,
      req.user.id,
    );

    return {
      success: true,
      message: 'BOQ version created successfully',
      data: boq,
    };
  }

  // ========================================
  // GET ALL BOQ VERSIONS FOR A PROJECT
  // ========================================
  @Get('project/:projectId')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPERVISOR,
    UserRole.ARCHITECT,
    UserRole.CLIENT,
  )
  async findByProject(@Param('projectId') projectId: string, @Request() req) {
    // Client can only view their own project
    if (req.user.role === UserRole.CLIENT) {
      const project = await this.projectsService.findOne(projectId);
      if (project.client_user_id !== req.user.id) {
        throw new ForbiddenException('Access denied to this project');
      }
    }

    const boqs = await this.boqService.findByProject(projectId);

    return {
      success: true,
      count: boqs.length,
      data: boqs,
    };
  }

  // ========================================
  // GET LATEST BOQ VERSION
  // ========================================
  @Get('latest/:projectId')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPERVISOR,
    UserRole.ARCHITECT,
    UserRole.CLIENT,
  )
  async getLatest(@Param('projectId') projectId: string, @Request() req) {
    // Client access control
    if (req.user.role === UserRole.CLIENT) {
      const project = await this.projectsService.findOne(projectId);
      if (project.client_user_id !== req.user.id) {
        throw new ForbiddenException('Access denied to this project');
      }
    }

    const latestBoq = await this.boqService.getLatest(projectId);

    if (!latestBoq) {
      throw new NotFoundException('No BOQ found for this project');
    }

    return {
      success: true,
      data: latestBoq,
    };
  }

  // ========================================
  // GET SINGLE BOQ VERSION BY ID
  // ========================================
  @Get(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPERVISOR,
    UserRole.ARCHITECT,
    UserRole.CLIENT,
  )
  async findOne(@Param('id') id: string, @Request() req) {
    const boq = await this.boqService.findOne(id);

    // Client access control
    if (req.user.role === UserRole.CLIENT) {
      const project = await this.projectsService.findOne(boq.project_id);
      if (project.client_user_id !== req.user.id) {
        throw new ForbiddenException('Access denied to this project');
      }
    }

    return {
      success: true,
      data: boq,
    };
  }

  // ========================================
  // UPDATE BOQ VERSION (Optional - Usually new version is created)
  // ========================================
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.ARCHITECT)
  async update(
    @Param('id') id: string,
    @Body() updateBoqDto: CreateBoqVersionDto, // Reuse create DTO for simplicity
  ) {
    // Note: In BOQ, it's usually better to create new version instead of updating old one
    // This endpoint is kept for flexibility

    // TODO: Implement update logic in service if needed
    // For now, returning message
    return {
      success: true,
      message:
        'BOQ update endpoint ready. Recommended to create new version instead.',
    };
  }
}
