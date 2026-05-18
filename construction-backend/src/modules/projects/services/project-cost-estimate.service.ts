import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProjectCostEstimate } from '../models/project_cost_estimates.model';
import { Project } from '../models/project.model';

@Injectable()
export class ProjectCostEstimateService {
  constructor(
    @InjectModel(ProjectCostEstimate)
    private costModel: typeof ProjectCostEstimate,
    @InjectModel(Project) private projectModel: typeof Project,
  ) {}

  async add(dto: any) {
    await this.projectModel.findByPk(dto.project_id, { rejectOnEmpty: true });
    return this.costModel.create(dto);
  }

  async findByProject(project_id: string) {
    return this.costModel.findAll({
      where: { project_id },
      order: [['created_at', 'DESC']],
    });
  }

  async update(id: string, dto: any) {
    const estimate = await this.costModel.findByPk(id);
    if (!estimate) throw new NotFoundException('Cost estimate not found');

    await estimate.update(dto);
    return estimate;
  }

  async delete(id: string) {
    return this.costModel.destroy({ where: { id } });
  }
}
