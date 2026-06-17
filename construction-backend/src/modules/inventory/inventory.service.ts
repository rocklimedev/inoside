import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuid } from 'uuid';
import { Op } from 'sequelize';
import { InventoryCategory } from './models/inventory-category.model';
import { InventoryRequest } from './models/inventory-request.model';
import { InventoryDispatch } from './models/inventory-dispatch.model';
import { InventoryMaster } from './models/inventory-master.model';
import { ProjectMaterial } from './models/project-materials.model'; // ← Corrected
import { Brand } from './models/brand.model';
import { Unit } from '../boq/models/unit.model';

import { CreateInventoryRequestDto } from './dto/create-inventory-request.dto';
import { UpdateInventoryRequestDto } from './dto/update-inventory-request.dto';
import { CreateInventoryDispatchDto } from './dto/create-inventory-dispatch.dto';
import { UpdateInventoryDispatchDto } from './dto/update-inventory-dispatch.dto';
import { CreateInventoryMasterDto } from './dto/create-inventory-master.dto';
import { UpdateInventoryMasterDto } from './dto/update-inventory-master.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryRequest)
    private requestModel: typeof InventoryRequest,

    @InjectModel(InventoryDispatch)
    private dispatchModel: typeof InventoryDispatch,

    @InjectModel(InventoryMaster)
    private masterModel: typeof InventoryMaster,

    @InjectModel(ProjectMaterial)
    private projectMaterialModel: typeof ProjectMaterial,

    @InjectModel(Brand)
    private brandModel: typeof Brand,

    @InjectModel(Unit)
    private unitModel: typeof Unit,
  ) {}

  // ====================== UNITS ======================

  async createUnit(name: string, shortName: string) {
    const existing = await this.unitModel.findOne({
      where: { short_name: shortName.toLowerCase().trim() },
    });

    if (existing) {
      throw new ConflictException(
        `Unit with short name "${shortName}" already exists`,
      );
    }

    return this.unitModel.create({
      id: uuid(),
      name: name.trim(),
      short_name: shortName.toLowerCase().trim(),
    });
  }

  async findAllUnits() {
    return this.unitModel.findAll({ order: [['name', 'ASC']] });
  }

  async findUnitById(id: string) {
    const unit = await this.unitModel.findByPk(id);
    if (!unit) throw new NotFoundException('Unit not found');
    return unit;
  }

  async findUnitByShortName(shortName: string) {
    const unit = await this.unitModel.findOne({
      where: { short_name: shortName.toLowerCase().trim() },
    });

    if (!unit)
      throw new NotFoundException(
        `Unit with short name "${shortName}" not found`,
      );
    return unit;
  }

  async updateUnit(id: string, name?: string, shortName?: string) {
    const unit = await this.findUnitById(id);

    if (shortName) {
      const existing = await this.unitModel.findOne({
        where: { short_name: shortName.toLowerCase().trim() },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Short name "${shortName}" is already in use`,
        );
      }
    }

    return unit.update({
      ...(name && { name: name.trim() }),
      ...(shortName && { short_name: shortName.toLowerCase().trim() }),
    });
  }

  async deleteUnit(id: string) {
    const unit = await this.findUnitById(id);

    const usedInMaster = await this.masterModel.count({
      where: { unit_id: id },
    });
    if (usedInMaster > 0) {
      throw new BadRequestException(
        'Cannot delete unit: It is referenced by inventory items',
      );
    }

    await unit.destroy();
    return { message: 'Unit deleted successfully' };
  }

  // ====================== INVENTORY REQUEST ======================

  async createRequest(dto: CreateInventoryRequestDto) {
    return this.requestModel.create({
      id: uuid(),
      ...dto,
    });
  }

  async findAllRequests() {
    return this.requestModel.findAll({
      include: [
        { all: true, nested: true },
        // or explicitly:
        // 'project', 'projectMaterial', 'vendor', 'requester', 'approver'
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findRequestById(id: string) {
    const request = await this.requestModel.findByPk(id, {
      include: { all: true, nested: true },
    });

    if (!request) throw new NotFoundException('Inventory request not found');
    return request;
  }

  async updateRequest(id: string, dto: UpdateInventoryRequestDto) {
    const request = await this.findRequestById(id);
    return request.update(dto);
  }

  async deleteRequest(id: string) {
    const request = await this.findRequestById(id);
    await request.destroy();
    return { message: 'Request deleted successfully' };
  }

  // ====================== INVENTORY DISPATCH ======================

  async createDispatch(dto: CreateInventoryDispatchDto) {
    return this.dispatchModel.create({
      id: uuid(),
      ...dto,
    });
  }

  async findAllDispatches() {
    return this.dispatchModel.findAll({
      include: [{ all: true, nested: true }],
      order: [['created_at', 'DESC']],
    });
  }

  async findDispatchById(id: string) {
    const dispatch = await this.dispatchModel.findByPk(id, {
      include: [{ all: true, nested: true }],
    });

    if (!dispatch) throw new NotFoundException('Dispatch record not found');
    return dispatch;
  }

  async updateDispatch(id: string, dto: UpdateInventoryDispatchDto) {
    const dispatch = await this.findDispatchById(id);
    return dispatch.update(dto);
  }

  async deleteDispatch(id: string) {
    const dispatch = await this.findDispatchById(id);
    await dispatch.destroy();
    return { message: 'Dispatch deleted successfully' };
  }

  // ====================== INVENTORY MASTER ======================

  async createMaster(dto: CreateInventoryMasterDto) {
    return this.masterModel.create({
      id: uuid(),
      ...dto,
    });
  }

  async findAllMaster() {
    return this.masterModel.findAll({
      include: [
        { model: Brand, as: 'brand' },
        { model: Unit, as: 'unit' },
        { model: InventoryCategory, as: 'category' }, // if you have category model
      ],
      order: [['item_name', 'ASC']],
    });
  }

  async findMasterById(id: string) {
    const item = await this.masterModel.findByPk(id, {
      include: ['brand', 'unit', 'category'],
    });

    if (!item) throw new NotFoundException('Inventory item not found');
    return item;
  }

  async updateMaster(id: string, dto: UpdateInventoryMasterDto) {
    const item = await this.findMasterById(id);
    return item.update(dto);
  }

  async deleteMaster(id: string) {
    const item = await this.findMasterById(id);
    await item.destroy();
    return { message: 'Inventory item deleted successfully' };
  }

  // ====================== PROJECT MATERIALS & BRANDS ======================

  async findAllProjectMaterials() {
    return this.projectMaterialModel.findAll({
      include: ['project', 'inventoryMaster', 'unit', 'brand'],
    });
  }
  // ====================== PROJECT MATERIALS ======================

  async findProjectMaterialsByProject(projectId: string) {
    return this.projectMaterialModel.findAll({
      where: { project_id: projectId },
      include: ['project', 'inventoryMaster', 'unit', 'brand'],
      order: [['item_name', 'ASC']],
    });
  }

  async findProjectMaterialById(id: string) {
    const material = await this.projectMaterialModel.findByPk(id, {
      include: ['project', 'inventoryMaster', 'unit', 'brand'],
    });

    if (!material) {
      throw new NotFoundException('Project material not found');
    }

    return material;
  }

  async getProjectMaterialSummary(projectId: string) {
    const materials = await this.projectMaterialModel.findAll({
      where: { project_id: projectId },
    });

    return {
      totalMaterials: materials.length,

      estimatedQty: materials.reduce(
        (sum, m) => sum + Number(m.quantity_estimated || 0),
        0,
      ),

      requiredQty: materials.reduce(
        (sum, m) => sum + Number(m.quantity_required || 0),
        0,
      ),

      receivedQty: materials.reduce(
        (sum, m) => sum + Number(m.quantity_received || 0),
        0,
      ),

      usedQty: materials.reduce(
        (sum, m) => sum + Number(m.quantity_used || 0),
        0,
      ),
    };
  }

  async getProjectInventoryValue(projectId: string) {
    const materials = await this.projectMaterialModel.findAll({
      where: { project_id: projectId },
    });

    const totalValue = materials.reduce((sum, item) => {
      return sum + Number(item.quantity_required || 0) * Number(item.rate || 0);
    }, 0);

    return {
      projectId,
      totalValue,
    };
  }

  async getProjectMaterialStatus(projectId: string) {
    const materials = await this.projectMaterialModel.findAll({
      where: { project_id: projectId },
    });

    return {
      planned: materials.filter((m) => m.status === 'planned').length,
      ordered: materials.filter((m) => m.status === 'ordered').length,
      received: materials.filter((m) => m.status === 'received').length,
      inUse: materials.filter((m) => m.status === 'in_use').length,
      closed: materials.filter((m) => m.status === 'closed').length,
    };
  }

  async getPendingMaterials(projectId?: string) {
    const where: any = {
      status: {
        [Op.in]: ['planned', 'ordered'],
      },
    };

    if (projectId) {
      where.project_id = projectId;
    }

    return this.projectMaterialModel.findAll({
      where,
      include: ['project', 'inventoryMaster', 'unit', 'brand'],
    });
  }

  async getMaterialConsumption(projectId: string) {
    const materials = await this.projectMaterialModel.findAll({
      where: { project_id: projectId },
      include: ['inventoryMaster'],
    });

    return materials.map((m) => ({
      id: m.id,
      itemName: m.item_name,
      estimated: m.quantity_estimated,
      required: m.quantity_required,
      received: m.quantity_received,
      used: m.quantity_used,
      balance: Number(m.quantity_received || 0) - Number(m.quantity_used || 0),
    }));
  }

  // ====================== REQUESTS ======================

  async findRequestsByProject(projectId: string) {
    return this.requestModel.findAll({
      where: { project_id: projectId },
      include: [{ all: true, nested: true }],
      order: [['created_at', 'DESC']],
    });
  }

  async getPendingRequests() {
    return this.requestModel.findAll({
      where: {
        status: {
          [Op.in]: ['draft', 'submitted', 'approved'],
        },
      },
      include: [{ all: true, nested: true }],
    });
  }

  // ====================== DISPATCHES ======================

  async findDispatchesByProject(projectId: string) {
    return this.dispatchModel.findAll({
      where: { project_id: projectId },
      include: [{ all: true, nested: true }],
      order: [['created_at', 'DESC']],
    });
  }

  // ====================== INVENTORY MASTER ======================

  async searchInventory(query: string) {
    return this.masterModel.findAll({
      where: {
        [Op.or]: [
          {
            item_name: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            item_code: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      },
      include: ['brand', 'unit', 'category'],
      limit: 25,
      order: [['item_name', 'ASC']],
    });
  }

  async getInventoryByCategory(categoryId: string) {
    return this.masterModel.findAll({
      where: {
        category_id: categoryId,
        is_active: true,
      },
      include: ['brand', 'unit', 'category'],
    });
  }

  async getInventoryByBrand(brandId: string) {
    return this.masterModel.findAll({
      where: {
        brand_id: brandId,
        is_active: true,
      },
      include: ['brand', 'unit', 'category'],
    });
  }

  // ====================== DASHBOARD ======================

  async getInventoryDashboard() {
    const [
      totalItems,
      totalBrands,
      totalUnits,
      totalRequests,
      totalDispatches,
      totalProjectMaterials,
    ] = await Promise.all([
      this.masterModel.count(),
      this.brandModel.count(),
      this.unitModel.count(),
      this.requestModel.count(),
      this.dispatchModel.count(),
      this.projectMaterialModel.count(),
    ]);

    return {
      totalItems,
      totalBrands,
      totalUnits,
      totalRequests,
      totalDispatches,
      totalProjectMaterials,
    };
  }

  async getProjectInventoryDashboard(projectId: string) {
    const [materials, requests, dispatches] = await Promise.all([
      this.projectMaterialModel.count({
        where: { project_id: projectId },
      }),
      this.requestModel.count({
        where: { project_id: projectId },
      }),
      this.dispatchModel.count({
        where: { project_id: projectId },
      }),
    ]);

    return {
      projectId,
      materials,
      requests,
      dispatches,
    };
  }
  async findAllBrands() {
    return this.brandModel.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']],
    });
  }

  async createBrand(name: string) {
    const trimmedName = name.trim();

    const existing = await this.brandModel.findOne({
      where: { name: trimmedName },
    });

    if (existing) {
      throw new ConflictException('Brand with this name already exists');
    }

    return this.brandModel.create({
      id: uuid(),
      name: trimmedName,
      is_active: true,
    } as any); // ← Temporary safe cast
  }
  async deleteBrand(id: string) {
    const brand = await this.brandModel.findByPk(id);
    if (!brand) throw new NotFoundException('Brand not found');

    // Optional: Check usage before delete
    const used = await this.masterModel.count({ where: { brand_id: id } });
    if (used > 0) {
      throw new BadRequestException('Cannot delete brand: It is in use');
    }

    await brand.destroy();
    return { message: 'Brand deleted successfully' };
  }
}
