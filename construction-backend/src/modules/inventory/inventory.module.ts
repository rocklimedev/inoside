import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

import { InventoryRequest } from './models/inventory-request.model';
import { InventoryDispatch } from './models/inventory-dispatch.model';
import { InventoryMaster } from './models/inventory-master.model';
import { ProjectMaterial } from './models/project-materials.model';
import { InventoryCategory } from './models/inventory-category.model';
import { Brand } from './models/brand.model';
import { Unit } from '../boq/models/unit.model';
@Module({
  imports: [
    SequelizeModule.forFeature([
      InventoryRequest,
      InventoryDispatch,
      InventoryMaster,
      ProjectMaterial,
      Unit,
      Brand,
      InventoryCategory,
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
