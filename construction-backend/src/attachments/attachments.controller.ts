import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  Param,
  Req,
  ParseEnumPipe,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { CreateDesignUploadDto } from './dto/create-design-upload.dto';
import { CreateExecutionDrawingDto } from './dto/create-execution-drawing.dto';
import { AttachmentEntityType } from './entities/attachments.entity';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { ForbiddenException } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';

@Controller('attachments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttachmentsController {
  constructor(
    private readonly service: AttachmentsService,
    private readonly projectsService: ProjectsService,
  ) {}

  // ====================== GENERIC ATTACHMENTS ======================
  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.ARCHITECT)
  create(@Body() dto: CreateAttachmentDto, @Req() req) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPERVISOR,
    UserRole.ARCHITECT,
    UserRole.CLIENT,
  )
  getByEntity(
    @Query('entity_type', new ParseEnumPipe(AttachmentEntityType))
    entity_type: AttachmentEntityType,

    @Query('entity_id')
    entity_id: string,
  ) {
    return this.service.findByEntity(entity_type, entity_id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.ARCHITECT)
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }

  // ====================== DESIGN UPLOADS ======================
  @Post('design/:projectId')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.ARCHITECT)
  async uploadDesign(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateDesignUploadDto,
    @Req() req,
  ) {
    await this.projectsService.findOne(projectId);

    const design = await this.service.createDesignUpload(
      projectId,
      dto,
      req.user.id,
    );

    return {
      success: true,
      message: 'Design uploaded successfully',
      data: design,
    };
  }

  @Get('design/:projectId')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPERVISOR,
    UserRole.ARCHITECT,
    UserRole.CLIENT,
  )
  async getDesigns(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Req() req,
  ) {
    if (req.user.role === UserRole.CLIENT) {
      const project = await this.projectsService.findOne(projectId);
      if (project.client_user_id !== req.user.id) {
        throw new ForbiddenException('Access denied to this project');
      }
    }

    const designs = await this.service.findDesignByProject(projectId);
    return { success: true, count: designs.length, data: designs };
  }

  // ====================== EXECUTION DRAWINGS ======================
  @Post('execution/:projectId')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.ARCHITECT)
  async uploadExecution(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateExecutionDrawingDto,
    @Req() req,
  ) {
    await this.projectsService.findOne(projectId);

    const drawing = await this.service.createExecutionDrawing(
      projectId,
      dto,
      req.user.id,
    );

    return {
      success: true,
      message: 'Execution drawing added successfully',
      data: drawing,
    };
  }

  @Get('execution/:projectId')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPERVISOR,
    UserRole.ARCHITECT,
    UserRole.CLIENT,
  )
  async getExecutions(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Req() req,
  ) {
    if (req.user.role === UserRole.CLIENT) {
      const project = await this.projectsService.findOne(projectId);
      if (project.client_user_id !== req.user.id) {
        throw new ForbiddenException('Access denied to this project');
      }
    }

    const drawings = await this.service.findExecutionByProject(projectId);
    return { success: true, count: drawings.length, data: drawings };
  }
}
