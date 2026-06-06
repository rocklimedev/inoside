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
  async findAll() {
    return this.costModel.findAll({
      include: [
        {
          model: this.projectModel,
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }
  async add(dto: any) {
    await this.projectModel.findByPk(dto.project_id, { rejectOnEmpty: true });
    this.validateDto(dto);
    return this.costModel.create(dto);
  }

  async findByProject(project_id: string) {
    return this.costModel.findAll({
      where: { project_id },
      order: [['created_at', 'DESC']],
    });
  }
  async findById(id: string) {
    const estimate = await this.costModel.findOne({
      where: { id },
      include: [
        {
          model: this.projectModel,
        },
      ],
    });

    if (!estimate) {
      throw new NotFoundException('Cost estimate not found');
    }

    return estimate;
  }
  async update(id: string, dto: any) {
    const estimate = await this.costModel.findByPk(id);
    if (!estimate) throw new NotFoundException('Cost estimate not found');

    this.validateDto(dto);
    await estimate.update(dto);
    return estimate;
  }

  async delete(id: string) {
    return this.costModel.destroy({ where: { id } });
  }

  // ---------------- VALIDATION ----------------
  private validateDto(dto: any) {
    const isValidEstimateItem = (i: any) =>
      typeof i.title === 'string' &&
      typeof i.description === 'string' &&
      (i.price === undefined ||
        i.price === null ||
        typeof i.price === 'number');

    const isValidPaymentItem = (i: any) =>
      typeof i.title === 'string' &&
      typeof i.description === 'string' &&
      (i.amount === undefined ||
        i.amount === null ||
        typeof i.amount === 'number');

    // Material & Labour
    if (
      dto.material_labour_estimate &&
      !Array.isArray(dto.material_labour_estimate)
    ) {
      throw new BadRequestException(
        'material_labour_estimate must be an array',
      );
    }
    if (
      dto.material_labour_estimate &&
      !dto.material_labour_estimate.every(isValidEstimateItem)
    ) {
      throw new BadRequestException('Invalid material_labour_estimate format');
    }

    // Payment Plan
    if (dto.payment_plan && !Array.isArray(dto.payment_plan)) {
      throw new BadRequestException('payment_plan must be an array');
    }
    if (dto.payment_plan && !dto.payment_plan.every(isValidPaymentItem)) {
      throw new BadRequestException('Invalid payment_plan format');
    }
  }
}
