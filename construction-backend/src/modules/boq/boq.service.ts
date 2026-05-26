import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';

import { Boq } from './models/boq.model';
import { BoqCategory } from './models/boq-category.model';
import { BoqSection } from './models/boq-section.model';
import { BoqSubHeading } from './models/boq-subheading.model';
import { BoqItem } from './models/boq-item.model';
import { Unit } from './models/unit.model';

import { Project } from '@/modules/projects/models/project.model';
import { Client } from '@/modules/clients/models/client.model';

import { InventoryMaster } from '@/modules/inventory/models/inventory-master.model';
import { Brand } from '@/modules/inventory/models/brand.model';

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

    @InjectModel(InventoryMaster)
    private inventoryMasterModel: typeof InventoryMaster,
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
    const boq = await this.boqModel.create({
      ...dto,
      project_id: dto.project_id || null,
      client_id: dto.client_id || null,
    });

    return this.getBoqWithDetails(boq.id);
  }
  // ====================== UPDATE BOQ ======================

  // ====================== UPDATE BOQ ======================

  async updateBoq(id: string, dto: Partial<CreateBoqDto>) {
    const boq = await this.boqModel.findByPk(id);

    if (!boq) {
      throw new NotFoundException('BOQ not found');
    }

    // ================= VALIDATE CATEGORY =================

    if (dto.boq_category_id) {
      const category = await this.boqCategoryModel.findByPk(
        dto.boq_category_id,
      );

      if (!category) {
        throw new NotFoundException('BOQ category not found');
      }
    }

    // ================= VALIDATE PROJECT =================

    if (dto.project_id) {
      const project = await Project.findByPk(dto.project_id);

      if (!project) {
        throw new NotFoundException('Project not found');
      }
    }

    // ================= VALIDATE CLIENT =================

    if (dto.client_id) {
      const client = await Client.findByPk(dto.client_id);

      if (!client) {
        throw new NotFoundException('Client not found');
      }
    }

    // ================= UPDATE =================

    await boq.update({
      title: dto.title ?? boq.title,
      notes: dto.notes ?? boq.notes,
      code: dto.code ?? boq.code,
      revision_no: dto.revision_no ?? boq.revision_no,

      boq_category_id:
        dto.boq_category_id !== undefined
          ? dto.boq_category_id
          : boq.boq_category_id,

      project_id:
        dto.project_id !== undefined ? dto.project_id : boq.project_id,

      client_id: dto.client_id !== undefined ? dto.client_id : boq.client_id,

      prepared_by:
        dto.prepared_by !== undefined ? dto.prepared_by : boq.prepared_by,
    });

    return this.getBoqWithDetails(id);
  }
  async findAllBoqs(projectId?: string, clientId?: string) {
    const where: any = {};

    if (projectId) {
      where.project_id = projectId;
    }

    if (clientId) {
      where.client_id = clientId;
    }

    return this.boqModel.findAll({
      where,
      include: [
        {
          model: Project,
          attributes: ['id', 'name'],
        },
        {
          model: Client,
          attributes: ['id', 'name', 'contact_number'],
        },
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
                  include: [
                    Unit,
                    {
                      model: InventoryMaster,
                      include: [Brand],
                    },
                  ],
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
          model: Project,
          attributes: ['id', 'name'],
        },
        {
          model: Client,
          attributes: ['id', 'name', 'contact_number'],
        },
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
                  include: [
                    Unit,
                    {
                      model: InventoryMaster,
                      include: [Brand],
                    },
                  ],
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
  // ====================== GET BOQS BY CLIENT ======================

  async getBoqsByClient(clientId: string) {
    const client = await Client.findByPk(clientId);

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return this.boqModel.findAll({
      where: {
        client_id: clientId,
      },

      include: [
        {
          model: Project,
          attributes: ['id', 'name'],
        },

        {
          model: Client,
          attributes: ['id', 'name', 'contact_number', 'email'],
        },

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
                  include: [
                    Unit,
                    {
                      model: InventoryMaster,
                      include: [Brand],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],

      order: [['created_at', 'DESC']],
    });
  }
  // ====================== SECTIONS ======================

  async createSection(dto: CreateBoqSectionDto) {
    await this.validateBoqExists(dto.boq_id);

    return this.boqSectionModel.create(dto);
  }
  /** NEW: Update Section */
  async updateSection(id: string, dto: Partial<CreateBoqSectionDto>) {
    const section = await this.boqSectionModel.findByPk(id);
    if (!section) {
      throw new NotFoundException('Section not found');
    }

    await section.update({
      title: dto.title ?? section.title,
      description: dto.description ?? section.description,
      sort_order: dto.sort_order ?? section.sort_order,
    });

    return section;
  }

  /** NEW: Delete Section (Cascading will delete subheadings & items) */
  async deleteSection(id: string) {
    const section = await this.boqSectionModel.findByPk(id);
    if (!section) {
      throw new NotFoundException('Section not found');
    }

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
              include: [
                Unit,
                {
                  model: InventoryMaster,
                  include: [Brand],
                },
              ],
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

  /** NEW: Update Subheading */
  async updateSubHeading(id: string, dto: Partial<CreateBoqSubHeadingDto>) {
    const subheading = await this.boqSubHeadingModel.findByPk(id);
    if (!subheading) {
      throw new NotFoundException('Subheading not found');
    }

    await subheading.update({
      title: dto.title ?? subheading.title,
      description: dto.description ?? subheading.description,
      sort_order: dto.sort_order ?? subheading.sort_order,
    });

    return subheading;
  }

  /** NEW: Delete Subheading */
  async deleteSubHeading(id: string) {
    const subheading = await this.boqSubHeadingModel.findByPk(id);
    if (!subheading) {
      throw new NotFoundException('Subheading not found');
    }

    await subheading.destroy();
    return { message: 'Subheading deleted successfully' };
  }
  async findSubHeadingsBySection(sectionId: string) {
    return this.boqSubHeadingModel.findAll({
      where: { section_id: sectionId },
      include: [
        {
          model: BoqItem,
          include: [
            Unit,
            {
              model: InventoryMaster,
              include: [Brand],
            },
          ],
        },
      ],
      order: [['sort_order', 'ASC']],
    });
  }

  // ====================== UNIT HELPER ======================

  private async resolveUnitId(unitInput?: string): Promise<string | null> {
    if (!unitInput?.trim()) {
      return null;
    }

    const trimmed = unitInput.trim();

    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;

    if (uuidRegex.test(trimmed)) {
      return trimmed;
    }

    const unit = await this.unitModel.findOne({
      where: {
        short_name: trimmed.toLowerCase(),
      },
    });

    if (unit) {
      return unit.id;
    }

    console.warn(`⚠️ Unit with short_name "${trimmed}" not found.`);

    return null;
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

    const finalUnitId = await this.resolveUnitId(dto.unit_id);

    let inventoryMasterId: string;

    // ================= AUTO CREATE INVENTORY ITEM =================

    if (!dto.inventory_master_id) {
      let master = await this.inventoryMasterModel.findOne({
        where: {
          item_name: dto.item_name.trim(),
          ...(dto.item_code && {
            item_code: dto.item_code,
          }),
        },
      });

      if (!master) {
        master = await this.inventoryMasterModel.create({
          id: uuidv4(),
          item_name: dto.item_name.trim(),
          item_code: dto.item_code || `AUTO-${Date.now()}`,
          description: dto.description || null,
          specification: dto.specification || null,
          brand_id: null,
          unit_id: finalUnitId,
          default_rate: dto.rate || 0,
          is_active: true,
        } as any);
      }

      inventoryMasterId = master.id;
    } else {
      const existingMaster = await this.inventoryMasterModel.findByPk(
        dto.inventory_master_id,
      );

      if (!existingMaster) {
        throw new NotFoundException('Inventory master item not found');
      }

      inventoryMasterId = existingMaster.id;
    }

    // ================= CREATE BOQ ITEM =================

    const item = await this.boqItemModel.create({
      boq_id: dto.boq_id,
      section_id: dto.section_id,
      subheading_id: dto.subheading_id || null,
      inventory_master_id: inventoryMasterId,
      sno: dto.sno || null,
      item_name: dto.item_name.trim(),
      item_code: dto.item_code || null,
      description: dto.description || null,
      specification: dto.specification || null,
      brand: dto.brand || null,
      unit_id: finalUnitId,
      qty: dto.qty ?? 0,
      rate: dto.rate ?? 0,
      wastage_percent: dto.wastage_percent ?? 0,
      discount_percent: dto.discount_percent ?? 0,
      tax_percent: dto.tax_percent ?? 18,
      remarks: dto.remarks || null,
      sort_order: dto.sort_order ?? 0,
    });
    await this.calculateBoqTotal(dto.boq_id);

    return this.boqItemModel.findByPk(item.id, {
      include: [
        Unit,
        {
          model: InventoryMaster,
          include: [Brand],
        },
      ],
    });
  }

  // ====================== UPDATE ITEM ======================

  async updateItem(id: string, updateData: Partial<CreateBoqItemDto>) {
    const item = await this.boqItemModel.findByPk(id);

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (updateData.unit_id !== undefined) {
      const resolvedUnitId = await this.resolveUnitId(
        updateData.unit_id as string,
      );

      (updateData as any).unit_id = resolvedUnitId;
    }

    await item.update(updateData);

    await this.calculateBoqTotal(item.boq_id);

    return this.boqItemModel.findByPk(id, {
      include: [
        Unit,
        {
          model: InventoryMaster,
          include: [Brand],
        },
      ],
    });
  }

  // ====================== DELETE ITEM ======================

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

  // ====================== DELETE BOQ ======================

  async deleteBoq(id: string) {
    const boq = await this.boqModel.findByPk(id);

    if (!boq) {
      throw new NotFoundException('BOQ not found');
    }

    await this.boqItemModel.destroy({
      where: { boq_id: id },
    });

    await this.boqSubHeadingModel.destroy({
      where: { boq_id: id },
    });

    await this.boqSectionModel.destroy({
      where: { boq_id: id },
    });

    await boq.destroy();

    return {
      message: 'BOQ deleted successfully',
    };
  }

  // ====================== CALCULATIONS ======================

  async calculateBoqTotal(boqId: string) {
    const items = await this.boqItemModel.findAll({
      where: { boq_id: boqId },
    });

    const subtotal = items.reduce((sum, item) => {
      return sum + Number(item.final_amount || item.base_amount || 0);
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

  // ====================== VALIDATE BOQ ======================

  async validateBoqExists(id: string) {
    const boq = await this.boqModel.findByPk(id);

    if (!boq) {
      throw new NotFoundException('BOQ not found');
    }

    return boq;
  }
}
