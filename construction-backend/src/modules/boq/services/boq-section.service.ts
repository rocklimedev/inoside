import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { BoqSection } from '../models/boq-section.model';
import { BoqSubHeading } from '../models/boq-subheading.model';
import { BoqItem } from '../models/boq-item.model';
import { Unit } from '../models/unit.model';
import { InventoryMaster } from '@/modules/inventory/models/inventory-master.model';
import { Brand } from '@/modules/inventory/models/brand.model';

import { CreateBoqSectionDto } from '../dto/create-boq-section.dto';

@Injectable()
export class BoqSectionService {
  constructor(
    @InjectModel(BoqSection)
    private boqSectionModel: typeof BoqSection,
  ) {}

  async createSection(dto: CreateBoqSectionDto) {
    return this.boqSectionModel.create(dto);
  }

  async updateSection(id: string, dto: Partial<CreateBoqSectionDto>) {
    const section = await this.boqSectionModel.findByPk(id);
    if (!section) throw new NotFoundException('Section not found');

    await section.update({
      title: dto.title ?? section.title,
      description: dto.description ?? section.description,
      sort_order: dto.sort_order ?? section.sort_order,
    });

    return section;
  }

  async deleteSection(id: string) {
    const section = await this.boqSectionModel.findByPk(id);
    if (!section) throw new NotFoundException('Section not found');

    await section.destroy();
    return { message: 'Section deleted successfully' };
  }

  async findSectionsByBoq(boqId: string) {
    return this.boqSectionModel.findAll({
      where: { boq_id: boqId },
      include: [
        {
          model: BoqSubHeading,
          include: [
            {
              model: BoqItem,
              include: [Unit, { model: InventoryMaster, include: [Brand] }],
            },
          ],
        },
      ],
      order: [['sort_order', 'ASC']],
    });
  }

  async findById(id: string) {
    return this.boqSectionModel.findByPk(id);
  }
}
