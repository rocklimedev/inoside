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
  // COMMON INCLUDE
  // ======================================================

  private getIncludes() {
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
    ];
  }

  // ======================================================
  // CREATE PROJECT
  // ======================================================

  async create(dto: any) {
    // ------------------------------------------
    // VALIDATE CLIENT
    // ------------------------------------------

    if (dto.client_id) {
      const client = await this.clientModel.findByPk(dto.client_id);

      if (!client) {
        throw new BadRequestException('Client not found');
      }
    }

    // ------------------------------------------
    // VALIDATE SITE
    // ------------------------------------------

    if (dto.site_id) {
      const site = await this.siteModel.findByPk(dto.site_id);

      if (!site) {
        throw new BadRequestException('Site not found');
      }
    }

    // ------------------------------------------
    // VALIDATE CREATOR
    // ------------------------------------------

    if (dto.created_by) {
      const user = await this.userModel.findByPk(dto.created_by);

      if (!user) {
        throw new BadRequestException('Creator user not found');
      }
    }

    // ------------------------------------------
    // CREATE PROJECT
    // ------------------------------------------

    const project = await this.projectModel.create(dto);

    return this.findOne(project.id);
  }

  // ======================================================
  // GET ALL PROJECTS
  // ======================================================

  async findAll() {
    return this.projectModel.findAll({
      include: this.getIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  // ======================================================
  // GET PROJECT BY ID
  // ======================================================

  async findOne(id: string) {
    const project = await this.projectModel.findByPk(id, {
      include: this.getIncludes(),
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

    // ------------------------------------------
    // VALIDATE CLIENT
    // ------------------------------------------

    if (dto.client_id) {
      const client = await this.clientModel.findByPk(dto.client_id);

      if (!client) {
        throw new BadRequestException('Client not found');
      }
    }

    // ------------------------------------------
    // VALIDATE SITE
    // ------------------------------------------

    if (dto.site_id) {
      const site = await this.siteModel.findByPk(dto.site_id);

      if (!site) {
        throw new BadRequestException('Site not found');
      }
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

    const project = await this.findOne(id);

    await project.update({
      progress_percentage: progress,
    });

    return this.findOne(id);
  }

  // ======================================================
  // ASSIGN PROJECT
  // ======================================================

  async assignProject(
    id: string,
    dto: {
      assigned_to: string;
    },
  ) {
    const project = await this.findOne(id);

    const user = await this.userModel.findByPk(dto.assigned_to);

    if (!user) {
      throw new NotFoundException('Assigned user not found');
    }

    await project.update({
      assigned_to: dto.assigned_to,
    });

    return this.findOne(id);
  }

  // ======================================================
  // ARCHIVE PROJECT
  // ======================================================

  async archiveProject(id: string) {
    const project = await this.findOne(id);

    await project.update({
      is_archived: true,
    });

    return this.findOne(id);
  }

  // ======================================================
  // UNARCHIVE PROJECT
  // ======================================================

  async unarchiveProject(id: string) {
    const project = await this.findOne(id);

    await project.update({
      is_archived: false,
    });

    return this.findOne(id);
  }

  // ======================================================
  // GET PROJECTS BY CLIENT
  // ======================================================

  async getProjectsByClient(clientId: string) {
    return this.projectModel.findAll({
      where: {
        client_id: clientId,
      },
      include: this.getIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  // ======================================================
  // GET PROJECTS BY STATUS
  // ======================================================

  async getProjectsByStatus(status: string) {
    return this.projectModel.findAll({
      where: {
        status,
      },
      include: this.getIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  // ======================================================
  // GET PROJECTS BY USER
  // ======================================================

  async getProjectsByUser(userId: string) {
    return this.projectModel.findAll({
      where: {
        [Op.or]: [{ created_by: userId }, { assigned_to: userId }],
      },
      include: this.getIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  // ======================================================
  // SEARCH PROJECTS
  // ======================================================

  async searchProjects(query: string) {
    return this.projectModel.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${query}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${query}%`,
            },
          },
        ],
      },
      include: this.getIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  // ======================================================
  // GET ACTIVE PROJECTS
  // ======================================================

  async getActiveProjects() {
    return this.projectModel.findAll({
      where: {
        is_archived: false,
      },
      include: this.getIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  // ======================================================
  // GET ARCHIVED PROJECTS
  // ======================================================

  async getArchivedProjects() {
    return this.projectModel.findAll({
      where: {
        is_archived: true,
      },
      include: this.getIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  // ======================================================
  // PROJECT STATS
  // ======================================================

  async getProjectStats() {
    const total = await this.projectModel.count();

    const active = await this.projectModel.count({
      where: {
        is_archived: false,
      },
    });

    const archived = await this.projectModel.count({
      where: {
        is_archived: true,
      },
    });

    const completed = await this.projectModel.count({
      where: {
        status: 'Completed',
      },
    });

    const inProgress = await this.projectModel.count({
      where: {
        status: 'In Progress',
      },
    });

    return {
      total,
      active,
      archived,
      completed,
      inProgress,
    };
  }
}
