import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProjectCostEstimate } from '../models/project_cost_estimates.model';
import { Project } from '../models/project.model';

@Injectable()
export class ProjectCostEstimateService {
  constructor(
    @InjectModel(ProjectCostEstimate)
    private costModel: typeof ProjectCostEstimate,

    @InjectModel(Project)
    private projectModel: typeof Project,
  ) {}

  // ---------------- CREATE ----------------
  async add(dto: any) {
    await this.projectModel.findByPk(dto.project_id, {
      rejectOnEmpty: true,
    });

    this.validateDto(dto);

    return this.costModel.create(dto);
  }

  // ---------------- READ ----------------
  async findByProject(project_id: string) {
    return this.costModel.findAll({
      where: { project_id },
      order: [['created_at', 'DESC']],
    });
  }

  // ---------------- UPDATE ----------------
  async update(id: string, dto: any) {
    const estimate = await this.costModel.findByPk(id);

    if (!estimate) {
      throw new NotFoundException('Cost estimate not found');
    }

    this.validateDto(dto);

    await estimate.update(dto);
    return estimate;
  }

  // ---------------- DELETE ----------------
  async delete(id: string) {
    return this.costModel.destroy({ where: { id } });
  }

  // ---------------- VALIDATION ----------------
  private validateDto(dto: any) {
    const isValidArray = (arr: any) =>
      Array.isArray(arr) &&
      arr.every(
        (i) => typeof i.title === 'string' && typeof i.description === 'string',
      );

    if (
      dto.material_labour_estimate &&
      !isValidArray(dto.material_labour_estimate)
    ) {
      throw new BadRequestException('Invalid material_labour_estimate format');
    }

    if (dto.payment_plan && !isValidArray(dto.payment_plan)) {
      throw new BadRequestException('Invalid payment_plan format');
    }
  }
}
