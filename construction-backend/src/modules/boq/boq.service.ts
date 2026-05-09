import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Boq } from './models/boq.model';
import { BoqCategory } from './models/boq-category.model';
import { BoqSection } from './models/boq-section.model';
import { BoqItem } from './models/boq-item.model';
import { Unit } from './models/unit.model';

import { CreateBoqDto } from './dto/create-boq.dto';
import { CreateBoqSectionDto } from './dto/create-boq-section.dto';
import { CreateBoqItemDto } from './dto/create-boq-item.dto';

@Injectable()
export class BoqService {
  constructor(
    @InjectModel(Boq) private boqModel: typeof Boq,
    @InjectModel(BoqCategory) private boqCategoryModel: typeof BoqCategory,
    @InjectModel(BoqSection) private boqSectionModel: typeof BoqSection,
    @InjectModel(BoqItem) private boqItemModel: typeof BoqItem,
    @InjectModel(Unit) private unitModel: typeof Unit,
  ) {}

  // ====================== BOQ ======================

  async createBoq(dto: CreateBoqDto) {
    const boq = await this.boqModel.create(dto);
    return this.getBoqWithDetails(boq.id);
  }

  async findAllBoqs(projectId?: string) {
    return this.boqModel.findAll({
      where: projectId ? { project_id: projectId } : {},
      include: [
        { model: BoqCategory, attributes: ['id', 'name'] },
        {
          model: BoqSection,
          include: [
            {
              model: BoqItem,
              include: [Unit],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async getBoqWithDetails(id: string) {
    const boq = await this.boqModel.findByPk(id, {
      include: [
        { model: BoqCategory, attributes: ['id', 'name'] },
        {
          model: BoqSection,
          include: [
            {
              model: BoqItem,
              include: [Unit],
            },
          ],
        },
      ],
    });

    if (!boq) throw new NotFoundException('BOQ not found');
    return boq;
  }

  // ====================== BOQ SECTIONS ======================

  async createSection(dto: CreateBoqSectionDto) {
    const boq = await this.boqModel.findByPk(dto.boq_id);
    if (!boq) throw new NotFoundException('BOQ not found');

    return this.boqSectionModel.create(dto);
  }

  async findSectionsByBoq(boqId: string) {
    return this.boqSectionModel.findAll({
      where: { boq_id: boqId },
      include: [
        {
          model: BoqItem,
          include: [Unit],
        },
      ],
      order: [['sort_order', 'ASC']],
    });
  }

  // ====================== BOQ ITEMS ======================

  async createItem(dto: CreateBoqItemDto) {
    const section = await this.boqSectionModel.findByPk(dto.section_id);
    if (!section) throw new NotFoundException('Section not found');

    const item = await this.boqItemModel.create(dto);

    return this.boqItemModel.findByPk(item.id, {
      include: [Unit],
    });
  }

  async updateItem(id: string, updateData: Partial<CreateBoqItemDto>) {
    const item = await this.boqItemModel.findByPk(id);
    if (!item) throw new NotFoundException('Item not found');

    await item.update(updateData);

    return this.boqItemModel.findByPk(id, {
      include: [Unit],
    });
  }

  async deleteItem(id: string) {
    const item = await this.boqItemModel.findByPk(id);
    if (!item) throw new NotFoundException('Item not found');

    await item.destroy();
    return { message: 'Item deleted successfully' };
  }

  // ====================== CALCULATIONS ======================

  async calculateBoqTotal(boqId: string) {
    const items = await this.boqItemModel.findAll({
      where: { boq_id: boqId },
    });

    const subtotal = items.reduce((sum, item) => {
      return sum + Number(item.amount || 0);
    }, 0);

    await this.boqModel.update(
      {
        subtotal,
        grand_total: subtotal,
      },
      {
        where: { id: boqId },
      },
    );

    return {
      subtotal,
      grand_total: subtotal,
    };
  }

  async recalculateSectionTotal(sectionId: string) {
    const items = await this.boqItemModel.findAll({
      where: { section_id: sectionId },
    });

    return items.reduce((sum, item) => {
      return sum + Number(item.amount || 0);
    }, 0);
  }

  // ====================== OPTIONAL HELPERS ======================

  async validateBoqExists(id: string) {
    const boq = await this.boqModel.findByPk(id);
    if (!boq) throw new NotFoundException('BOQ not found');
    return boq;
  }
}
