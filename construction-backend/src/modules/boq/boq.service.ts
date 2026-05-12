import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Boq } from './models/boq.model';
import { BoqCategory } from './models/boq-category.model';
import { BoqSection } from './models/boq-section.model';
import { BoqSubHeading } from './models/boq-subheading.model';
import { BoqItem } from './models/boq-item.model';
import { Unit } from './models/unit.model';

import { CreateBoqDto } from './dto/create-boq.dto';
import { CreateBoqSectionDto } from './dto/create-boq-section.dto';
import { CreateBoqItemDto } from './dto/create-boq-item.dto';
import { CreateBoqSubHeadingDto } from './dto/create-boq-subheading.dto';
import { CreateBoqCategoryDto } from './dto/create-boq-category.dto';
@Injectable()
export class BoqService {
  constructor(
    @InjectModel(Boq) private boqModel: typeof Boq,
    @InjectModel(BoqCategory) private boqCategoryModel: typeof BoqCategory,
    @InjectModel(BoqSection) private boqSectionModel: typeof BoqSection,
    @InjectModel(BoqSubHeading)
    private boqSubHeadingModel: typeof BoqSubHeading,
    @InjectModel(BoqItem) private boqItemModel: typeof BoqItem,
    @InjectModel(Unit) private unitModel: typeof Unit,
  ) {}

  // ====================== BOQ CATEGORY ======================

  async findAllCategories(projectId?: string) {
    return this.boqCategoryModel.findAll({
      where: projectId ? { project_id: projectId } : {},
      order: [['sort_order', 'ASC']],
      include: [{ model: Boq }],
    });
  }

  async createCategory(data: CreateBoqCategoryDto) {
    return this.boqCategoryModel.create({
      project_id: data.project_id,
      name: data.name,
      description: data.description,
      sort_order: data.sort_order ?? 0,
    });
  }
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
              model: BoqSubHeading,
              include: [
                {
                  model: BoqItem,
                  include: [Unit],
                },
              ],
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
              model: BoqSubHeading,
              include: [
                {
                  model: BoqItem,
                  include: [Unit],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!boq) throw new NotFoundException('BOQ not found');
    return boq;
  }

  async validateBoqExists(id: string) {
    const boq = await this.boqModel.findByPk(id);
    if (!boq) throw new NotFoundException('BOQ not found');
    return boq;
  }

  // ====================== SECTIONS ======================

  async createSection(dto: CreateBoqSectionDto) {
    const boq = await this.validateBoqExists(dto.boq_id);
    return this.boqSectionModel.create(dto);
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
              include: [Unit],
            },
          ],
        },
      ],
      order: [['sort_order', 'ASC']],
    });
  }

  // ====================== SUB HEADINGS ======================

  async createSubHeading(data: CreateBoqSubHeadingDto) {
    const section = await this.boqSectionModel.findByPk(data.section_id);

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    return this.boqSubHeadingModel.create({
      section_id: data.section_id,
      title: data.title,
      description: data.description,
      sort_order: data.section_order,
    });
  }
  async findSubHeadingsBySection(sectionId: string) {
    return this.boqSubHeadingModel.findAll({
      where: { section_id: sectionId },
      include: [
        {
          model: BoqItem,
          include: [Unit],
        },
      ],
      order: [['sort_order', 'ASC']],
    });
  }

  // ====================== ITEMS ======================

  async createItem(dto: CreateBoqItemDto) {
    const subheading = await this.boqSubHeadingModel.findByPk(
      (dto as any).subheading_id,
    );

    if (!subheading) throw new NotFoundException('SubHeading not found');

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
      { where: { id: boqId } },
    );

    return { subtotal, grand_total: subtotal };
  }

  async recalculateSectionTotal(sectionId: string) {
    const subheadings = await this.boqSubHeadingModel.findAll({
      where: { section_id: sectionId },
      attributes: ['id'],
    });

    const subheadingIds = subheadings.map((s) => s.id);

    const items = await this.boqItemModel.findAll({
      where: {
        subheading_id: subheadingIds,
      },
    });

    return items.reduce((sum, item) => {
      return sum + Number(item.amount || 0);
    }, 0);
  }
}
