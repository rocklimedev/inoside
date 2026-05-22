import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { RekiReport } from '../models/reki_reports.model';
import { Project } from '../models/project.model';
import { Client } from '@/modules/clients/models/client.model';
import { Site } from '@/modules/sites/models/site.model';
import { User } from '@/modules/users/models/user.model';

@Injectable()
export class RekiReportService {
  constructor(
    @InjectModel(RekiReport)
    private rekiModel: typeof RekiReport,

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
        attributes: ['id', 'name', 'status', 'progress_percentage'],
        include: [
          {
            model: Client,
            attributes: ['id', 'name', 'email', 'contact_number'],
          },
          {
            model: Site,
            attributes: ['id', 'address', 'city'],
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

  // ======================================================
  // CREATE REKI REPORT
  // ======================================================

  async create(dto: any) {
    // ------------------------------------------
    // VALIDATE PROJECT
    // ------------------------------------------

    const project = await this.projectModel.findByPk(dto.project_id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // ------------------------------------------
    // CHECK EXISTING
    // ------------------------------------------

    const existing = await this.rekiModel.findOne({
      where: {
        project_id: dto.project_id,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Reki Report already exists for this project',
      );
    }

    // ------------------------------------------
    // CREATE REKI
    // ------------------------------------------

    const reki = await this.rekiModel.create(dto);

    // ------------------------------------------
    // UPDATE PROJECT STATUS
    // ------------------------------------------

    await project.update({
      status: 'reki_pending',
      current_stage: 'Reki Started',
    });

    return this.findById(reki.id);
  }

  // ======================================================
  // GET REKI BY PROJECT
  // ======================================================

  async findByProject(projectId: string) {
    const reki = await this.rekiModel.findOne({
      where: {
        project_id: projectId,
      },
      include: this.getIncludes(),
    });

    if (!reki) {
      throw new NotFoundException('Reki Report not found');
    }

    return reki;
  }

  // ======================================================
  // GET REKI BY ID
  // ======================================================

  async findById(id: string) {
    const reki = await this.rekiModel.findByPk(id, {
      include: this.getIncludes(),
    });

    if (!reki) {
      throw new NotFoundException('Reki Report not found');
    }

    return reki;
  }

  // ======================================================
  // GET ALL REKI REPORTS
  // ======================================================

  async findAll() {
    return this.rekiModel.findAll({
      include: this.getIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  // ======================================================
  // UPDATE REKI
  // ======================================================

  async update(projectId: string, dto: any) {
    const reki = await this.rekiModel.findOne({
      where: {
        project_id: projectId,
      },
    });

    if (!reki) {
      throw new NotFoundException('Reki Report not found');
    }

    await reki.update(dto);

    return this.findByProject(projectId);
  }

  // ======================================================
  // DELETE REKI
  // ======================================================

  async delete(id: string) {
    const reki = await this.rekiModel.findByPk(id);

    if (!reki) {
      throw new NotFoundException('Reki Report not found');
    }

    await reki.destroy();

    return {
      success: true,
      message: 'Reki Report deleted successfully',
    };
  }

  // ======================================================
  // MARK REKI DONE
  // ======================================================

  async markAsDone(projectId: string) {
    const reki = await this.findByProject(projectId);

    const project = await this.projectModel.findByPk(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await project.update({
      status: 'reki_done',
      current_stage: 'Reki Completed',
      progress_percentage: 25,
    });

    return this.findByProject(projectId);
  }

  // ======================================================
  // MARK REKI PENDING
  // ======================================================

  async markAsPending(projectId: string) {
    const reki = await this.findByProject(projectId);

    const project = await this.projectModel.findByPk(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await project.update({
      status: 'reki_pending',
      current_stage: 'Reki Pending',
    });

    return reki;
  }
}
