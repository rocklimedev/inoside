import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { Project } from './models/project.model';
import { Client } from '../clients/models/client.model';
import { Site } from '../sites/models/site.model';
import { User } from '../users/models/user.model';
import { Address } from '../address/models/address.model';

// ===================== STAGE MODELS =====================
import { ProjectBrief } from './models/project_brief.model';
import { ProjectPitch } from './models/project_pitch.model';
import { RekiReport } from './models/reki_reports.model';
import { ScopeOfWork } from './models/scope_of_work.model';
import { ProjectCostEstimate } from './models/project_cost_estimates.model';
import { ProjectDrawing } from './models/project-drawings.model';
import { PitchReference } from './models/pitch_references.model';
import { PitchComment } from './models/pitch-comment.model';
import { RekiPhoto } from './models/reki_photos.model';
import { DrawingApprovalLog } from './models/drawing_approval_logs.model';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project)
    private projectModel: typeof Project,

    @InjectModel(Client)
    private clientModel: typeof Client,

    @InjectModel(Site)
    private siteModel: typeof Site,

    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  // ======================================================
  // FULL INCLUDES WITH ALL STAGE DATA
  // ======================================================

  private getFullIncludes() {
    return [
      {
        model: Client,
        attributes: ['id', 'name', 'contact_number', 'email'],
      },
      {
        model: Site,
        as: 'site',
        include: [
          {
            model: Address,
            as: 'address',
          },
        ],
      },
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email'],
      },
      {
        model: User,
        as: 'assignedUser',
        attributes: ['id', 'name', 'email'],
      },

      // ==================== STAGE RELATIONS ====================

      // Brief
      {
        model: ProjectBrief,
        as: 'brief',
        include: [
          {
            model: User,
            as: 'approvedByUser',
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'changesRequestedByUser',
            attributes: ['id', 'name'],
          },
        ],
      },

      // Pitch
      {
        model: ProjectPitch,
        as: 'pitch',
        include: [
          {
            model: PitchComment,
            as: 'comments',
            include: [
              {
                model: User,
                attributes: ['id', 'name', 'email'],
              },
            ],
          },
          {
            model: User,
            as: 'createdByUser',
            attributes: ['id', 'name'],
          },
        ],
      },

      // Pitch References
      {
        model: PitchReference,
        as: 'pitchReferences',
      },

      // Reki
      {
        model: RekiReport,
        as: 'reki',
        include: [
          {
            model: User,
            as: 'supervisor',
            attributes: ['id', 'name'],
          },
          {
            model: RekiPhoto,
            as: 'rekiPhotos', // Make sure association exists in RekiReport model
          },
        ],
      },

      // Scope of Work
      {
        model: ScopeOfWork,
        as: 'scope',
      },

      // BOQ / Cost Estimates
      {
        model: ProjectCostEstimate,
        as: 'costEstimates',
      },

      // Drawings + Approval Logs
      {
        model: ProjectDrawing,
        as: 'drawings',
        include: [
          {
            model: DrawingApprovalLog,
            as: 'approvalLogs',
          },
          {
            model: User,
            as: 'uploadedBy',
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'approvedBy',
            attributes: ['id', 'name'],
          },
        ],
      },
    ];
  }

  // ======================================================
  // CREATE PROJECT
  // ======================================================

  async create(dto: any) {
    if (dto.client_id) {
      const client = await this.clientModel.findByPk(dto.client_id);
      if (!client) throw new BadRequestException('Client not found');
    }

    if (dto.site_id) {
      const site = await this.siteModel.findByPk(dto.site_id);
      if (!site) throw new BadRequestException('Site not found');
    }

    if (dto.created_by) {
      const user = await this.userModel.findByPk(dto.created_by);
      if (!user) throw new BadRequestException('Creator user not found');
    }

    const project = await this.projectModel.create(dto);
    return this.findOne(project.id);
  }

  // ======================================================
  // GET ALL PROJECTS
  // ======================================================

  async findAll() {
    return this.projectModel.findAll({
      include: this.getFullIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  // ======================================================
  // GET PROJECT BY ID (Rich Data)
  // ======================================================

  async findOne(id: string) {
    const project = await this.projectModel.findByPk(id, {
      include: this.getFullIncludes(),
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  // ======================================================
  // UPDATE PROJECT
  // ======================================================

  async update(id: string, dto: any) {
    const project = await this.findOne(id);

    if (dto.client_id) {
      const client = await this.clientModel.findByPk(dto.client_id);
      if (!client) throw new BadRequestException('Client not found');
    }

    if (dto.site_id) {
      const site = await this.siteModel.findByPk(dto.site_id);
      if (!site) throw new BadRequestException('Site not found');
    }

    await project.update(dto);
    return this.findOne(id);
  }

  // ======================================================
  // DELETE PROJECT
  // ======================================================

  async remove(id: string) {
    const project = await this.findOne(id);
    await project.destroy();

    return {
      success: true,
      message: 'Project deleted successfully',
    };
  }

  // ======================================================
  // UPDATE PROGRESS
  // ======================================================

  async updateProgress(id: string, progress: number) {
    if (progress < 0 || progress > 100) {
      throw new BadRequestException('Progress must be between 0 and 100');
    }

    await this.projectModel.update(
      { progress_percentage: progress },
      { where: { id } },
    );

    return this.findOne(id);
  }

  // ======================================================
  // ASSIGN PROJECT
  // ======================================================

  async assignProject(id: string, dto: { assigned_to: string }) {
    const project = await this.findOne(id);

    const user = await this.userModel.findByPk(dto.assigned_to);
    if (!user) throw new NotFoundException('Assigned user not found');

    await project.update({ assigned_to: dto.assigned_to });
    return this.findOne(id);
  }

  // ======================================================
  // ARCHIVE / UNARCHIVE
  // ======================================================

  async archiveProject(id: string) {
    await this.projectModel.update({ is_archived: true }, { where: { id } });
    return this.findOne(id);
  }

  async unarchiveProject(id: string) {
    await this.projectModel.update({ is_archived: false }, { where: { id } });
    return this.findOne(id);
  }

  // ======================================================
  // OTHER QUERY METHODS
  // ======================================================

  async getProjectsByClient(clientId: string) {
    return this.projectModel.findAll({
      where: { client_id: clientId },
      include: this.getFullIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  async getProjectsByStatus(status: string) {
    return this.projectModel.findAll({
      where: { status },
      include: this.getFullIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  async getProjectsByUser(userId: string) {
    return this.projectModel.findAll({
      where: {
        [Op.or]: [{ created_by: userId }, { assigned_to: userId }],
      },
      include: this.getFullIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  async searchProjects(query: string) {
    return this.projectModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
        ],
      },
      include: this.getFullIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  async getActiveProjects() {
    return this.projectModel.findAll({
      where: { is_archived: false },
      include: this.getFullIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  async getArchivedProjects() {
    return this.projectModel.findAll({
      where: { is_archived: true },
      include: this.getFullIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  // ======================================================
  // PROJECT STATS
  // ======================================================

  async getProjectStats() {
    const [total, active, archived, completed, inProgress] = await Promise.all([
      this.projectModel.count(),
      this.projectModel.count({ where: { is_archived: false } }),
      this.projectModel.count({ where: { is_archived: true } }),
      this.projectModel.count({ where: { status: 'completed' } }),
      this.projectModel.count({ where: { status: 'In Progress' } }),
    ]);

    return { total, active, archived, completed, inProgress };
  }
}
