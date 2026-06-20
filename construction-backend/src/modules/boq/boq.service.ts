import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

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
import { CreateBoqSubHeadingDto } from './dto/create-boq-subheading.dto';
import { CreateBoqItemDto } from './dto/create-boq-item.dto';
import { CreateBoqCategoryDto } from './dto/create-boq-category.dto';

import { BoqCategoryService } from './services/boq-category.service';
import { BoqSectionService } from './services/boq-section.service';
import { BoqSubHeadingService } from './services/boq-subheading.service';
import { BoqItemService } from './services/boq-item.service';

@Injectable()
export class BoqService {
  constructor(
    @InjectModel(Boq)
    private boqModel: typeof Boq,

    private readonly categoryService: BoqCategoryService,
    private readonly sectionService: BoqSectionService,
    private readonly subHeadingService: BoqSubHeadingService,
    private readonly itemService: BoqItemService,
  ) {}

  // ====================== BOQ CATEGORY (delegated) ======================

  findAllCategories() {
    return this.categoryService.findAllCategories();
  }

  createCategory(data: CreateBoqCategoryDto) {
    return this.categoryService.createCategory(data);
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

  async updateBoq(id: string, dto: Partial<CreateBoqDto>) {
    const boq = await this.boqModel.findByPk(id);
    if (!boq) throw new NotFoundException('BOQ not found');

    if (dto.boq_category_id) {
      const category = await this.categoryService.findById(dto.boq_category_id);
      if (!category) throw new NotFoundException('BOQ category not found');
    }

    if (dto.project_id) {
      const project = await Project.findByPk(dto.project_id);
      if (!project) throw new NotFoundException('Project not found');
    }

    if (dto.client_id) {
      const client = await Client.findByPk(dto.client_id);
      if (!client) throw new NotFoundException('Client not found');
    }

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
    if (projectId) where.project_id = projectId;
    if (clientId) where.client_id = clientId;

    return this.boqModel.findAll({
      where,
      include: this.boqIncludes(),
      order: [['created_at', 'DESC']],
    });
  }

  async updateBoqStatus(
    id: string,
    data: {
      status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'revised';
      approved_by?: string;
    },
  ) {
    const boq = await this.boqModel.findByPk(id);
    if (!boq) throw new NotFoundException('BOQ not found');

    await boq.update({
      status: data.status,
      approved_by:
        data.status === 'approved'
          ? (data.approved_by ?? boq.approved_by)
          : boq.approved_by,
    });

    return this.getBoqWithDetails(id);
  }

  async getBoqWithDetails(id: string) {
    const boq = await this.boqModel.findByPk(id, {
      include: this.boqIncludes(),
    });

    if (!boq) throw new NotFoundException('BOQ not found');
    return boq;
  }

  async getBoqsByClient(clientId: string) {
    const client = await Client.findByPk(clientId);
    if (!client) throw new NotFoundException('Client not found');

    return this.boqModel.findAll({
      where: { client_id: clientId },
      include: this.boqIncludes(true),
      order: [['created_at', 'DESC']],
    });
  }

  async deleteBoq(id: string) {
    const boq = await this.boqModel.findByPk(id);
    if (!boq) throw new NotFoundException('BOQ not found');

    await this.itemService.destroyAllByBoq(id);

    await BoqSubHeading.destroy({ where: { boq_id: id } });
    await BoqSection.destroy({ where: { boq_id: id } });

    await boq.destroy();
    return { message: 'BOQ deleted successfully' };
  }

  async validateBoqExists(id: string) {
    const boq = await this.boqModel.findByPk(id);
    if (!boq) throw new NotFoundException('BOQ not found');
    return boq;
  }

  // ====================== CALCULATIONS ======================

  async calculateBoqTotal(boqId: string) {
    const items = await this.itemService.findAllByBoq(boqId);

    const subtotal = items.reduce((sum, item) => {
      return sum + Number(item.qty || 0) * Number(item.rate || 0);
    }, 0);

    await this.boqModel.update(
      { subtotal, grand_total: subtotal },
      { where: { id: boqId } },
    );

    return { subtotal, grand_total: subtotal };
  }

  // ====================== SECTIONS (delegated) ======================

  async createSection(dto: CreateBoqSectionDto) {
    await this.validateBoqExists(dto.boq_id);
    return this.sectionService.createSection(dto);
  }

  updateSection(id: string, dto: Partial<CreateBoqSectionDto>) {
    return this.sectionService.updateSection(id, dto);
  }

  deleteSection(id: string) {
    return this.sectionService.deleteSection(id);
  }

  findSectionsByBoq(boqId: string) {
    return this.sectionService.findSectionsByBoq(boqId);
  }

  // ====================== SUB HEADINGS (delegated) ======================

  async createSubHeading(data: CreateBoqSubHeadingDto) {
    const section = await this.sectionService.findById(data.section_id);
    if (!section) throw new NotFoundException('Section not found');
    return this.subHeadingService.createSubHeading(data);
  }

  updateSubHeading(id: string, dto: Partial<CreateBoqSubHeadingDto>) {
    return this.subHeadingService.updateSubHeading(id, dto);
  }

  deleteSubHeading(id: string) {
    return this.subHeadingService.deleteSubHeading(id);
  }

  findSubHeadingsBySection(sectionId: string) {
    return this.subHeadingService.findSubHeadingsBySection(sectionId);
  }

  // ====================== ITEMS (delegated) ======================

  async createItem(dto: CreateBoqItemDto) {
    await this.validateBoqExists(dto.boq_id);

    const section = await this.sectionService.findById(dto.section_id);
    if (!section) throw new NotFoundException('Section not found');

    let subheadingExists = true;
    if (dto.subheading_id) {
      const subheading = await this.subHeadingService.findById(
        dto.subheading_id,
      );
      subheadingExists = !!subheading;
    }

    const item = await this.itemService.createItem(dto, subheadingExists);
    await this.calculateBoqTotal(dto.boq_id);
    return item;
  }

  async updateItem(id: string, updateData: Partial<CreateBoqItemDto>) {
    const { updatedItem, boqId } = await this.itemService.updateItem(
      id,
      updateData,
    );
    await this.calculateBoqTotal(boqId);
    return updatedItem;
  }

  async deleteItem(id: string) {
    const { boqId } = await this.itemService.deleteItem(id);
    await this.calculateBoqTotal(boqId);
    return { message: 'Item deleted successfully' };
  }

  // ====================== PRIVATE HELPERS ======================

  private boqIncludes(extendedClient = false) {
    return [
      {
        model: Project,
        attributes: ['id', 'name'],
      },
      {
        model: Client,
        attributes: extendedClient
          ? ['id', 'name', 'contact_number', 'email']
          : ['id', 'name', 'contact_number'],
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
                include: [Unit, { model: InventoryMaster, include: [Brand] }],
              },
            ],
          },
        ],
      },
    ];
  }
}
