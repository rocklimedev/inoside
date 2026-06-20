import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuid } from 'uuid';
import { Unit } from '@/modules/boq/models/unit.model';
import { InventoryMaster } from '../models/inventory-master.model';

@Injectable()
export class UnitService {
  constructor(
    @InjectModel(Unit)
    private unitModel: typeof Unit,

    @InjectModel(InventoryMaster)
    private masterModel: typeof InventoryMaster,
  ) {}

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

  async countTotal() {
    return this.unitModel.count();
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
}
