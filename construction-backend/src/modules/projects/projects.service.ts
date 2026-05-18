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

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private projectModel: typeof Project,
    @InjectModel(Client) private clientModel: typeof Client,
    @InjectModel(Site) private siteModel: typeof Site,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async create(dto: any) {
    const client = await this.clientModel.findByPk(dto.client_id);
    if (!client) {
      throw new BadRequestException('Client not found');
    }

    const project = await this.projectModel.create(dto);
    return this.findOne(project.id);
  }

  async findAll() {
    return this.projectModel.findAll({
      include: [
        {
          model: Client,
          attributes: ['id', 'name', 'contact_number', 'email'],
        },
        { model: Site, attributes: ['id', 'address', 'city'] },
        { model: User, as: 'creator', attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(id: string) {
    const project = await this.projectModel.findByPk(id, {
      include: [
        {
          model: Client,
          attributes: ['id', 'name', 'contact_number', 'email'],
        },
        { model: Site },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(id: string, dto: any) {
    const project = await this.findOne(id);
    await project.update(dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const project = await this.findOne(id);
    await project.destroy();
    return { message: 'Project deleted successfully' };
  }

  async updateProgress(id: string, progress: number) {
    if (progress < 0 || progress > 100) {
      throw new BadRequestException('Progress must be between 0 and 100');
    }
    const project = await this.findOne(id);
    await project.update({ progress_percentage: progress });
    return this.findOne(id);
  }
}
