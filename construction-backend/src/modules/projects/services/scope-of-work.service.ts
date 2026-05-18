import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ScopeOfWork } from '../models/scope_of_work.model';
import { Project } from '../models/project.model';

@Injectable()
export class ScopeOfWorkService {
  constructor(
    @InjectModel(ScopeOfWork) private scopeModel: typeof ScopeOfWork,
    @InjectModel(Project) private projectModel: typeof Project,
  ) {}

  async create(dto: any) {
    await this.projectModel.findByPk(dto.project_id, { rejectOnEmpty: true });

    const exists = await this.scopeModel.findOne({
      where: { project_id: dto.project_id },
    });
    if (exists) {
      throw new BadRequestException(
        'Scope of Work already exists for this project',
      );
    }

    return this.scopeModel.create(dto);
  }

  async findOne(project_id: string) {
    const scope = await this.scopeModel.findOne({ where: { project_id } });
    if (!scope) throw new NotFoundException('Scope of Work not found');
    return scope;
  }

  async update(project_id: string, dto: any) {
    await this.findOne(project_id);
    await this.scopeModel.update(dto, { where: { project_id } });
    return this.findOne(project_id);
  }
}
