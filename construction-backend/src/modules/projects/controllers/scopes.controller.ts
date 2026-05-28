import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ScopeOfWorkService } from '../services/scope-of-work.service';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ScopesController {
  constructor(private readonly scopeService: ScopeOfWorkService) {}

  // ======================================================
  // CREATE SCOPE
  // POST /projects/:id/scope
  // ======================================================

  @Post(':id/scope')
  async create(@Param('id') projectId: string, @Body() dto: any) {
    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    return this.scopeService.create({
      ...dto,
      project_id: projectId,
    });
  }

  // ======================================================
  // GET SCOPE BY PROJECT
  // GET /projects/:id/scope
  // ======================================================

  @Get(':id/scope')
  async find(@Param('id') projectId: string) {
    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    return this.scopeService.findByProject(projectId);
  }

  // ======================================================
  // UPDATE SCOPE
  // PATCH /projects/:id/scope
  // ======================================================

  @Patch(':id/scope')
  async update(@Param('id') projectId: string, @Body() dto: any) {
    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    return this.scopeService.update(projectId, dto);
  }

  // ======================================================
  // GET ALL SCOPES
  // GET /projects/scopes/all
  // ======================================================

  @Get('scopes/all')
  async findAll() {
    return this.scopeService.findAll();
  }

  // ======================================================
  // GET SCOPE BY ID
  // GET /projects/scopes/:scopeId
  // ======================================================

  @Get('scopes/:scopeId')
  async findById(@Param('scopeId') scopeId: string) {
    if (!scopeId) {
      throw new BadRequestException('Scope ID is required');
    }

    return this.scopeService.findById(scopeId);
  }

  // ======================================================
  // DELETE SCOPE
  // DELETE /projects/scopes/:scopeId
  // ======================================================

  @Delete('scopes/:scopeId')
  async delete(@Param('scopeId') scopeId: string) {
    if (!scopeId) {
      throw new BadRequestException('Scope ID is required');
    }

    return this.scopeService.delete(scopeId);
  }

  // ======================================================
  // MARK APPROVED
  // PATCH /projects/:id/scope/approve
  // ======================================================

  @Patch(':id/scope/approve')
  async markApproved(@Param('id') projectId: string) {
    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    return this.scopeService.markApproved(projectId);
  }

  // ======================================================
  // MARK REJECTED
  // PATCH /projects/:id/scope/reject
  // ======================================================

  @Patch(':id/scope/reject')
  async markRejected(
    @Param('id') projectId: string,
    @Body('reason') reason?: string,
  ) {
    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    return this.scopeService.markRejected(projectId, reason);
  }
}
