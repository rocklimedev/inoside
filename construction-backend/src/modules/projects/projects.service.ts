import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Project } from './models/project.model';
import { Client } from '../clients/models/client.model';
import { Site } from '../sites/models/site.model';
import { User } from '../users/models/user.model';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private projectModel: typeof Project,
    @InjectModel(Client) private clientModel: typeof Client,
  ) {}

  // ================= CREATE =================

  async create(dto: CreateProjectDto) {
    const client = await this.clientModel.findByPk(dto.client_id);

    if (!client) {
      throw new BadRequestException('Client not found');
    }

    const project = await this.projectModel.create(dto);

    return this.findOne(project.id);
  }

  // ================= READ ALL =================

  async findAll() {
    return this.projectModel.findAll({
      include: [
        {
          model: Client,
          attributes: ['id', 'name', 'contact_number', 'email'],
        },
        {
          model: Site,
          attributes: ['id', 'address', 'city'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  // ================= READ ONE =================

  async findOne(id: string) {
    const project = await this.projectModel.findByPk(id, {
      include: [
        {
          model: Client,
          attributes: ['id', 'name', 'contact_number', 'email'],
        },
        {
          model: Site,
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  // ================= UPDATE =================

  async update(id: string, dto: UpdateProjectDto) {
    const project = await this.findOne(id);

    await project.update(dto);

    return this.findOne(id);
  }

  // ================= DELETE =================

  async remove(id: string) {
    const project = await this.findOne(id);

    await project.destroy();

    return {
      message: 'Project deleted successfully',
    };
  }

  // ================= PROGRESS =================

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
}
