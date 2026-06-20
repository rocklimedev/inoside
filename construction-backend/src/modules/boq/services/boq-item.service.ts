import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';

import { BoqItem } from '../models/boq-item.model';
import { BoqSubHeading } from '../models/boq-subheading.model';
import { Unit } from '../models/unit.model';
import { InventoryMaster } from '@/modules/inventory/models/inventory-master.model';
import { Brand } from '@/modules/inventory/models/brand.model';

import { CreateBoqItemDto } from '../dto/create-boq-item.dto';

@Injectable()
export class BoqItemService {
  constructor(
    @InjectModel(BoqItem)
    private boqItemModel: typeof BoqItem,

    @InjectModel(Unit)
    private unitModel: typeof Unit,

    @InjectModel(InventoryMaster)
    private inventoryMasterModel: typeof InventoryMaster,
  ) {}

  // ====================== UNIT HELPER ======================

  async resolveUnitId(unitInput?: string): Promise<string | null> {
    if (!unitInput?.trim()) return null;

    const trimmed = unitInput.trim();
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;

    if (uuidRegex.test(trimmed)) return trimmed;

    const unit = await this.unitModel.findOne({
      where: { short_name: trimmed.toLowerCase() },
    });

    if (unit) return unit.id;

    console.warn(`⚠️ Unit with short_name "${trimmed}" not found.`);
    return null;
  }

  // ====================== INVENTORY MASTER HELPER ======================

  private async resolveInventoryMasterId(
    dto: CreateBoqItemDto,
    finalUnitId: string | null,
  ): Promise<string> {
    if (!dto.inventory_master_id) {
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
          unit_id: finalUnitId,
          default_rate: dto.rate || 0,
          is_active: true,
        } as any);
      }

      return master.id;
    }

    const existingMaster = await this.inventoryMasterModel.findByPk(
      dto.inventory_master_id,
    );
    if (!existingMaster)
      throw new NotFoundException('Inventory master item not found');

    return existingMaster.id;
  }

  // ====================== CRUD ======================

  async createItem(
    dto: CreateBoqItemDto,
    subheadingExists: boolean,
  ): Promise<BoqItem> {
    if (dto.subheading_id && !subheadingExists) {
      throw new NotFoundException('Subheading not found');
    }

    const finalUnitId = await this.resolveUnitId(dto.unit_id);

    const inventoryMasterId = await this.resolveInventoryMasterId(
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

    const createdItem = await this.boqItemModel.findByPk(item.id, {
      include: [Unit, { model: InventoryMaster, include: [Brand] }],
    });

    if (!createdItem) {
      throw new NotFoundException('Created item could not be loaded');
    }

    return createdItem;
  }

  async updateItem(id: string, updateData: Partial<CreateBoqItemDto>) {
    const item = await this.boqItemModel.findByPk(id);
    if (!item) throw new NotFoundException('Item not found');

    const dataToUpdate: any = { ...updateData };

    dataToUpdate.tax_percent = 0;

    if (updateData.unit_id !== undefined) {
      const resolvedUnitId = await this.resolveUnitId(updateData.unit_id);
      dataToUpdate.unit_id = resolvedUnitId ?? undefined;
    }

    if (dataToUpdate.discount_percent === null)
      dataToUpdate.discount_percent = 0;
    if (dataToUpdate.wastage_percent === null) dataToUpdate.wastage_percent = 0;

    await item.update(dataToUpdate);

    return {
      updatedItem: await this.boqItemModel.findByPk(id, {
        include: [Unit, { model: InventoryMaster, include: [Brand] }],
      }),
      boqId: item.boq_id,
    };
  }

  async deleteItem(id: string) {
    const item = await this.boqItemModel.findByPk(id);
    if (!item) throw new NotFoundException('Item not found');

    const boqId = item.boq_id;
    await item.destroy();

    return { boqId };
  }

  async findAllByBoq(boqId: string) {
    return this.boqItemModel.findAll({ where: { boq_id: boqId } });
  }

  async destroyAllByBoq(boqId: string) {
    return this.boqItemModel.destroy({ where: { boq_id: boqId } });
  }
}
