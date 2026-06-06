import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { BoqItem } from '../models/boq-item.model';
import { Unit } from '../models/unit.model';
import { InventoryMaster } from '@/modules/inventory/models/inventory-master.model';
import { Brand } from '@/modules/inventory/models/brand.model';
import { CreateBoqItemDto } from '../dto/create-boq-item.dto';
import { Boq } from '../models/boq.model';
import { BoqSection } from '../models/boq-section.model';
import { BoqSubHeading } from '../models/boq-subheading.model';

@Injectable()
export class BoqItemService {
  constructor(
    @InjectModel(BoqItem)
    private boqItemModel: typeof BoqItem,
    @InjectModel(Unit)
    private unitModel: typeof Unit,
    @InjectModel(InventoryMaster)
    private inventoryMasterModel: typeof InventoryMaster,
    @InjectModel(Boq)
    private boqModel: typeof Boq,

    @InjectModel(BoqSection)
    private boqSectionModel: typeof BoqSection,
  ) {}

  private async resolveUnitId(unitInput?: string): Promise<string | null> {
    if (!unitInput?.trim()) return null;

    const trimmed = unitInput.trim();
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;

    if (uuidRegex.test(trimmed)) return trimmed;

    const unit = await this.unitModel.findOne({
      where: { short_name: trimmed.toLowerCase() },
    });

    return unit?.id ?? null;
  }

  async create(dto: CreateBoqItemDto) {
    // Validations
    await this.validateReferences(dto);

    const finalUnitId = await this.resolveUnitId(dto.unit_id);

    const inventoryMasterId = await this.getOrCreateInventoryMaster(
      dto,
      finalUnitId,
    );

    const item = await this.boqItemModel.create({
      boq_id: dto.boq_id,
      section_id: dto.section_id,
      subheading_id: dto.subheading_id || null,
      inventory_master_id: inventoryMasterId,
      item_name: dto.item_name.trim(),
      specification: dto.specification || null,
      unit_id: finalUnitId,
      qty: dto.qty ?? 0,
      rate: dto.rate ?? 0,
      tax_percent: 0,
      discount_percent: 0,
      wastage_percent: dto.wastage_percent ?? 0,
      remarks: dto.remarks || null,
      sort_order: dto.sort_order ?? 0,
    });

    await this.calculateBoqTotal(dto.boq_id);

    return this.findOne(item.id);
  }

  async update(id: string, updateData: Partial<CreateBoqItemDto>) {
    const item = await this.boqItemModel.findByPk(id);
    if (!item) throw new NotFoundException('Item not found');

    const dataToUpdate: any = { ...updateData };
    dataToUpdate.tax_percent = 0;

    if (updateData.unit_id !== undefined) {
      dataToUpdate.unit_id =
        (await this.resolveUnitId(updateData.unit_id)) ?? undefined;
    }

    await item.update(dataToUpdate);
    await this.calculateBoqTotal(item.boq_id);

    return this.findOne(id);
  }

  async delete(id: string) {
    const item = await this.boqItemModel.findByPk(id);
    if (!item) throw new NotFoundException('Item not found');

    const boqId = item.boq_id;
    await item.destroy();
    await this.calculateBoqTotal(boqId);

    return { message: 'Item deleted successfully' };
  }

  private async validateReferences(dto: CreateBoqItemDto) {
    if (!(await this.boqModel.findByPk(dto.boq_id))) {
      throw new NotFoundException('BOQ not found');
    }
    if (!(await this.boqSectionModel.findByPk(dto.section_id))) {
      // You can inject BoqSectionModel if needed
      throw new NotFoundException('Section not found');
    }
    if (dto.subheading_id) {
      const sub = await BoqSubHeading.findByPk(dto.subheading_id);
      if (!sub) throw new NotFoundException('Subheading not found');
    }
  }

  private async getOrCreateInventoryMaster(
    dto: CreateBoqItemDto,
    unitId: string | null,
  ) {
    if (dto.inventory_master_id) {
      const master = await this.inventoryMasterModel.findByPk(
        dto.inventory_master_id,
      );
      if (!master)
        throw new NotFoundException('Inventory master item not found');
      return master.id;
    }

    let master = await this.inventoryMasterModel.findOne({
      where: { item_name: dto.item_name.trim() },
    });

    if (!master) {
      master = await this.inventoryMasterModel.create({
        id: uuidv4(),
        item_name: dto.item_name.trim(),
        item_code: dto.item_code || `AUTO-${Date.now()}`,
        description: dto.description || null,
        specification: dto.specification || null,
        brand_id: null,
        unit_id: unitId,
        default_rate: dto.rate || 0,
        is_active: true,
      } as any);
    }
    return master.id;
  }

  private async calculateBoqTotal(boqId: string) {
    const items = await this.boqItemModel.findAll({ where: { boq_id: boqId } });

    const subtotal = items.reduce((sum, item) => {
      return sum + Number(item.qty || 0) * Number(item.rate || 0);
    }, 0);

    await this.boqModel.update(
      { subtotal, grand_total: subtotal },
      { where: { id: boqId } },
    );

    return { subtotal, grand_total: subtotal };
  }

  async findOne(id: string) {
    return this.boqItemModel.findByPk(id, {
      include: [Unit, { model: InventoryMaster, include: [Brand] }],
    });
  }
}
