import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { ScopeOfWork } from '../models/scope_of_work.model';
import { Project } from '../models/project.model';
import { Client } from '@/modules/clients/models/client.model';
import { Site } from '@/modules/sites/models/site.model';
import { User } from '@/modules/users/models/user.model';
import { Address } from '@/modules/address/models/address.model';

@Injectable()
export class ScopeOfWorkService {
  constructor(
    @InjectModel(ScopeOfWork)
    private scopeModel: typeof ScopeOfWork,

    @InjectModel(Project)
    private projectModel: typeof Project,
  ) {}

  // ======================================================
  // COMMON INCLUDE
  // ======================================================

  private getIncludes() {
    return [
      {
        model: Project,
        attributes: [
          'id',
          'name',
          'status',
          'progress_percentage',
          'current_stage',
        ],
        include: [
          {
            model: Client,
            attributes: ['id', 'name', 'email', 'contact_number'],
          },
          {
            model: Site,
            as: 'site',
            attributes: [
              'id',
              'ownership_status',
              'access_available',
              'existing_structure',
            ],
            include: [
              {
                model: Address,
                as: 'address',
                attributes: [
                  'id',
                  'line1',
                  'line2',
                  'landmark',
                  'city',
                  'state',
                  'country',
                  'pincode',
                  'latitude',
                  'longitude',
                  'google_map_link',
                ],
              },
            ],
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'name', 'email'],
          },
        ],
      },
    ];
  }

  // Helper to sanitize JSON fields
  private sanitizeScopeData(dto: any) {
    return {
      ...dto,
      scope_summary: dto.scope_summary?.trim() || null,
      civil_works: Array.isArray(dto.civil_works) ? dto.civil_works : [],
      mep_works: Array.isArray(dto.mep_works) ? dto.mep_works : [],
      interior_works: Array.isArray(dto.interior_works)
        ? dto.interior_works
        : [],
      finishes: Array.isArray(dto.finishes) ? dto.finishes : [],
      area_summary: Array.isArray(dto.area_summary) ? dto.area_summary : [],
      scope_pdf_url: dto.scope_pdf_url?.trim() || null,
    };
  }

  // ======================================================
  // CREATE SCOPE OF WORK
  // ======================================================

  async create(dto: any) {
    const project = await this.projectModel.findByPk(dto.project_id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const exists = await this.scopeModel.findOne({
      where: { project_id: dto.project_id },
    });

    if (exists) {
      throw new BadRequestException(
        'Scope of Work already exists for this project',
      );
    }

    // Sanitize data before saving
    const sanitizedData = this.sanitizeScopeData(dto);

    const scope = await this.scopeModel.create(sanitizedData);

    // Update project status
    await project.update({
      status: 'scope_done',
      current_stage: 'Scope of Work Created',
      progress_percentage: 40,
    });

    return this.findById(scope.id);
  }

  // ======================================================
  // UPDATE SCOPE
  // ======================================================

  async update(projectId: string, dto: any) {
    const scope = await this.scopeModel.findOne({
      where: { project_id: projectId },
    });

    if (!scope) {
      throw new NotFoundException('Scope of Work not found');
    }

    const sanitizedData = this.sanitizeScopeData(dto);

    await scope.update(sanitizedData);

    return this.findByProject(projectId);
  }

  // ======================================================
  // GET SCOPE BY PROJECT
  // ======================================================

  async findByProject(projectId: string) {
    const scope = await this.scopeModel.findOne({
      where: { project_id: projectId },
      include: this.getIncludes(),
    });

    if (!scope) {
      throw new NotFoundException('Scope of Work not found');
    }

    return scope;
  }

  // ======================================================
  // GET SCOPE BY ID
  // ======================================================

  async findById(id: string) {
    const scope = await this.scopeModel.findByPk(id, {
      include: this.getIncludes(),
    });

    if (!scope) {
      throw new NotFoundException('Scope of Work not found');
    }

    return scope;
  }

  // ======================================================
  // GET ALL SCOPES
  // ======================================================

  async findAll() {
    return this.scopeModel.findAll({
      include: this.getIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  // ======================================================
  // DELETE SCOPE
  // ======================================================

  async delete(id: string) {
    const scope = await this.scopeModel.findByPk(id);

    if (!scope) {
      throw new NotFoundException('Scope of Work not found');
    }

    await scope.destroy();

    return { success: true, message: 'Scope of Work deleted successfully' };
  }

  // ======================================================
  // MARK SCOPE APPROVED
  // ======================================================

  async markApproved(projectId: string) {
    const scope = await this.findByProject(projectId);
    const project = await this.projectModel.findByPk(projectId);

    if (!project) throw new NotFoundException('Project not found');

    await project.update({
      current_stage: 'Scope Approved',
      progress_percentage: 45,
    });

    return scope;
  }

  // ======================================================
  // MARK SCOPE REJECTED
  // ======================================================

  async markRejected(projectId: string, reason?: string) {
    const scope = await this.findByProject(projectId);
    const project = await this.projectModel.findByPk(projectId);

    if (!project) throw new NotFoundException('Project not found');

    await project.update({
      current_stage: 'Scope Revisions Required',
    });

    return { scope, rejection_reason: reason || null };
  }
}
