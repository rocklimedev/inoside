import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProjectBrief } from '../models/project_brief.model';
import { Project } from '../models/project.model';
import { Client } from '@/modules/clients/models/client.model';
import { Site } from '@/modules/sites/models/site.model';
import { User } from '@/modules/users/models/user.model';

@Injectable()
export class ProjectBriefService {
  constructor(
    @InjectModel(ProjectBrief) private briefModel: typeof ProjectBrief,
    @InjectModel(Project) private projectModel: typeof Project,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async create(dto: any) {
    await this.projectModel.findByPk(dto.project_id, { rejectOnEmpty: true });

    const exists = await this.briefModel.findOne({
      where: { project_id: dto.project_id },
    });
    if (exists)
      throw new BadRequestException('Brief already exists for this project');

    return this.briefModel.create({
      ...dto,
      is_approved: false,
      approved_by: null,
      approved_at: null,
    });
  }

  async getBrief(briefId: string) {
    const brief = await this.briefModel.findOne({
      where: { id: briefId },
      include: [
        {
          model: Project,
          attributes: ['id', 'name', 'status'],
          include: [
            {
              model: Client,
              attributes: ['id', 'name', 'email', 'contact_number'],
            },
            { model: Site, attributes: ['id', 'address', 'city'] },
          ],
        },
        {
          model: User,
          as: 'approvedByUser',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!brief) throw new NotFoundException('Brief not found');

    const data = brief.toJSON() as any;

    return {
      ...data,
      project_name: data.project?.name || '',
      project_status: data.project?.status || '',
      client_name: data.project?.client?.name || '',
      client_email: data.project?.client?.email || '',
      client_phone: data.project?.client?.contact_number || '',
      project_address: data.project?.site?.address || '',
      project_city: data.project?.site?.city || '',
      approved_by_user: data.approvedByUser || null,
    };
  }

  async updateBrief(project_id: string, dto: any) {
    await this.getBrief(project_id); // ensure exists
    await this.briefModel.update(dto, { where: { project_id } });
    return this.getBrief(project_id);
  }

  async approveBrief(briefId: string, user_id: string) {
    const brief = await this.briefModel.findByPk(briefId);
    if (!brief) throw new NotFoundException('Brief not found');

    const user = await this.userModel.findByPk(user_id);
    if (!user) throw new NotFoundException('User not found');

    await brief.update({
      is_approved: true,
      approved_by: user_id,
      approved_at: new Date(),
      status: 'Approved',
    });

    return this.getBriefById(briefId);
  }

  async unapproveBrief(briefId: string) {
    const brief = await this.briefModel.findByPk(briefId);
    if (!brief) throw new NotFoundException('Brief not found');

    await brief.update({
      is_approved: false,
      approved_by: null,
      approved_at: null,
      status: 'Pending',
    });

    return this.getBriefById(briefId);
  }

  async requestBriefChanges(
    briefId: string,
    dto: { note?: string; requested_by?: string },
  ) {
    const brief = await this.briefModel.findByPk(briefId);
    if (!brief) throw new NotFoundException('Brief not found');

    await brief.update({
      status: 'Changes Requested',
      is_approved: false,
      approved_by: null,
      approved_at: null,
      changes_note: dto.note || null,
      changes_requested_by: dto.requested_by || null,
      changes_requested_at: new Date(),
    });

    return this.getBriefById(briefId);
  }

  async sendBriefToClient(briefId: string) {
    const brief = await this.briefModel.findByPk(briefId);
    if (!brief) throw new NotFoundException('Brief not found');

    await brief.update({ status: 'sent_to_client' });
    return this.getBriefById(briefId);
  }

  async markBriefAsDraft(briefId: string) {
    const brief = await this.briefModel.findByPk(briefId);
    if (!brief) throw new NotFoundException('Brief not found');

    await brief.update({
      status: 'draft',
      is_approved: false,
      approved_by: null,
      approved_at: null,
    });

    return this.getBriefById(briefId);
  }

  async getAllBriefs() {
    return this.briefModel.findAll({
      include: [
        {
          model: Project,
          attributes: ['id', 'name', 'status'],
          include: [
            {
              model: Client,
              attributes: ['id', 'name', 'email', 'contact_number'],
            },
          ],
        },
        {
          model: User,
          as: 'approvedByUser',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async getBriefById(id: string) {
    const brief = await this.briefModel.findByPk(id, {
      include: [
        {
          model: Project,
          attributes: ['id', 'name', 'status'],
          include: [
            {
              model: Client,
              attributes: ['id', 'name', 'email', 'contact_number'],
            },
            { model: Site, attributes: ['id', 'address', 'city'] },
          ],
        },
        {
          model: User,
          as: 'approvedByUser',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!brief) throw new NotFoundException(`Brief with ID ${id} not found`);

    const data = brief.toJSON() as any;
    return {
      ...data,
      project_name: data.project?.name || '',
      project_status: data.project?.status || '',
      client_name: data.project?.client?.name || '',
      client_email: data.project?.client?.email || '',
      client_phone: data.project?.client?.contact_number || '',
      project_address: data.project?.site?.address || '',
      project_city: data.project?.site?.city || '',
      approved_by_user: data.approvedByUser || null,
    };
  }
}
