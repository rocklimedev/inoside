import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Boq } from './models/boq.model';
import { BoqCategory } from './models/boq-category.model';
import { BoqSection } from './models/boq-section.model';
import { BoqSubHeading } from './models/boq-subheading.model';
import { BoqItem } from './models/boq-item.model';
import { Unit } from './models/unit.model';

import { InventoryItem } from '@/modules/inventory/models/inventory-item.model';

import { CreateBoqDto } from './dto/create-boq.dto';
import { CreateBoqSectionDto } from './dto/create-boq-section.dto';
import { CreateBoqItemDto } from './dto/create-boq-item.dto';
import { CreateBoqSubHeadingDto } from './dto/create-boq-subheading.dto';
import { CreateBoqCategoryDto } from './dto/create-boq-category.dto';

@Injectable()
export class BoqService {
  constructor(
    @InjectModel(Boq)
    private boqModel: typeof Boq,

    @InjectModel(BoqCategory)
    private boqCategoryModel: typeof BoqCategory,

    @InjectModel(BoqSection)
    private boqSectionModel: typeof BoqSection,

    @InjectModel(BoqSubHeading)
    private boqSubHeadingModel: typeof BoqSubHeading,

    @InjectModel(BoqItem)
    private boqItemModel: typeof BoqItem,

    @InjectModel(Unit)
    private unitModel: typeof Unit,

    @InjectModel(InventoryItem)
    private inventoryItemModel: typeof InventoryItem,
  ) {}

  // ====================== BOQ CATEGORY ======================

  async findAllCategories() {
    return this.boqCategoryModel.findAll({
      order: [['sort_order', 'ASC']],
      include: [{ model: Boq }],
    });
  }

  async createCategory(data: CreateBoqCategoryDto) {
    return this.boqCategoryModel.create({
      name: data.name,
      code: data.code,
      description: data.description,
      sort_order: data.sort_order ?? 0,
      is_active: true,
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
        {
          model: BoqCategory,
          attributes: ['id', 'name', 'code'],
        },
        {
          model: BoqSection,
          include: [
            {
              model: BoqSubHeading,
              include: [
                {
                  model: BoqItem,
                  include: [Unit, InventoryItem],
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
        {
          model: BoqCategory,
          attributes: ['id', 'name', 'code'],
        },
        {
          model: BoqSection,
          include: [
            {
              model: BoqSubHeading,
              include: [
                {
                  model: BoqItem,
                  include: [Unit, InventoryItem],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!boq) {
      throw new NotFoundException('BOQ not found');
    }

    return boq;
  }

  async validateBoqExists(id: string) {
    const boq = await this.boqModel.findByPk(id);

    if (!boq) {
      throw new NotFoundException('BOQ not found');
    }

    return boq;
  }

  // ====================== SECTIONS ======================

  async createSection(dto: CreateBoqSectionDto) {
    await this.validateBoqExists(dto.boq_id);

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
              include: [Unit, InventoryItem],
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
      boq_id: data.boq_id,
      section_id: data.section_id,
      title: data.title,
      description: data.description,
      sort_order: data.sort_order ?? 0,
    });
  }

  async findSubHeadingsBySection(sectionId: string) {
    return this.boqSubHeadingModel.findAll({
      where: { section_id: sectionId },

      include: [
        {
          model: BoqItem,
          include: [Unit, InventoryItem],
        },
      ],

      order: [['sort_order', 'ASC']],
    });
  }

  // ====================== ITEMS ======================

  async createItem(dto: CreateBoqItemDto) {
    const boq = await this.boqModel.findByPk(dto.boq_id);

    if (!boq) {
      throw new NotFoundException('BOQ not found');
    }

    const section = await this.boqSectionModel.findByPk(dto.section_id);

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    if (dto.subheading_id) {
      const subheading = await this.boqSubHeadingModel.findByPk(
        dto.subheading_id,
      );

      if (!subheading) {
        throw new NotFoundException('Subheading not found');
      }
    }

    let inventoryItem: InventoryItem | null = null;

    if (dto.inventory_item_id) {
      inventoryItem = await this.inventoryItemModel.findByPk(
        dto.inventory_item_id,
      );

      if (!inventoryItem) {
        throw new NotFoundException('Inventory item not found');
      }
    }

    const itemName = dto.item_name || inventoryItem?.item_name;

    if (!itemName) {
      throw new NotFoundException('Item name is required');
    }

    const item = await this.boqItemModel.create({
      ...dto,

      item_code: dto.item_code || inventoryItem?.item_code,

      item_name: itemName,

      description: dto.description || inventoryItem?.description,

      specification: dto.specification || inventoryItem?.specification,

      brand: dto.brand || inventoryItem?.brand,

      unit_id: dto.unit_id || inventoryItem?.unit_id,

      rate: dto.rate || inventoryItem?.default_rate,
    });

    await this.calculateBoqTotal(dto.boq_id);

    return this.boqItemModel.findByPk(item.id, {
      include: [Unit, InventoryItem],
    });
  }

  async updateItem(id: string, updateData: Partial<CreateBoqItemDto>) {
    const item = await this.boqItemModel.findByPk(id);

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (updateData.inventory_item_id) {
      const inventoryItem = await this.inventoryItemModel.findByPk(
        updateData.inventory_item_id,
      );

      if (!inventoryItem) {
        throw new NotFoundException('Inventory item not found');
      }
    }

    await item.update(updateData);

    await this.calculateBoqTotal(item.boq_id);

    return this.boqItemModel.findByPk(id, {
      include: [Unit, InventoryItem],
    });
  }

  async deleteItem(id: string) {
    const item = await this.boqItemModel.findByPk(id);

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    const boqId = item.boq_id;

    await item.destroy();

    await this.calculateBoqTotal(boqId);

    return {
      message: 'Item deleted successfully',
    };
  }

  // ====================== CALCULATIONS ======================

  async calculateBoqTotal(boqId: string) {
    const items = await this.boqItemModel.findAll({
      where: { boq_id: boqId },
    });

    const subtotal = items.reduce((sum, item) => {
      return sum + Number(item.final_amount || 0);
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
      where: {
        section_id: sectionId,
      },
    });

    return items.reduce((sum, item) => {
      return sum + Number(item.final_amount || 0);
    }, 0);
  }
}
