import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { BoqSubHeading } from '../models/boq-subheading.model';
import { BoqItem } from '../models/boq-item.model';
import { Unit } from '../models/unit.model';
import { InventoryMaster } from '@/modules/inventory/models/inventory-master.model';
import { Brand } from '@/modules/inventory/models/brand.model';

import { CreateBoqSubHeadingDto } from '../dto/create-boq-subheading.dto';

@Injectable()
export class BoqSubHeadingService {
  constructor(
    @InjectModel(BoqSubHeading)
    private boqSubHeadingModel: typeof BoqSubHeading,
  ) {}

  async createSubHeading(data: CreateBoqSubHeadingDto) {
    return this.boqSubHeadingModel.create({
      boq_id: data.boq_id,
      section_id: data.section_id,
      title: data.title,
      description: data.description,
      sort_order: data.sort_order ?? 0,
    });
  }

  async updateSubHeading(id: string, dto: Partial<CreateBoqSubHeadingDto>) {
    const subheading = await this.boqSubHeadingModel.findByPk(id);
    if (!subheading) throw new NotFoundException('Subheading not found');

    await subheading.update({
      title: dto.title ?? subheading.title,
      description: dto.description ?? subheading.description,
      sort_order: dto.sort_order ?? subheading.sort_order,
    });

    return subheading;
  }

  async deleteSubHeading(id: string) {
    const subheading = await this.boqSubHeadingModel.findByPk(id);
    if (!subheading) throw new NotFoundException('Subheading not found');

    await subheading.destroy();
    return { message: 'Subheading deleted successfully' };
  }

  async findSubHeadingsBySection(sectionId: string) {
    return this.boqSubHeadingModel.findAll({
      where: { section_id: sectionId },
      include: [
        {
          model: BoqItem,
          include: [Unit, { model: InventoryMaster, include: [Brand] }],
        },
      ],
      order: [['sort_order', 'ASC']],
    });
  }

  async findById(id: string) {
    return this.boqSubHeadingModel.findByPk(id);
  }
}
