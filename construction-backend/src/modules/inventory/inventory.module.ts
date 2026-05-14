import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { InventoryMaster } from './models/inventory-master.model';
import { InventoryRequest } from './models/inventory-request.model';
import { InventoryDispatch } from './models/inventory-dispatch.model';
import { Material } from './models/materials.model';

import { InventoryMasterService } from './services/inventory-master.service';
import { InventoryRequestService } from './services/inventory-request.service';
import { InventoryDispatchService } from './services/inventory-dispatch.service';

import { InventoryRequestController } from './inventory-request.controller';
import { InventoryDispatchController } from './inventory-disptach.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      InventoryMaster,
      InventoryRequest,
      InventoryDispatch,
      Material,
    ]),
  ],

  controllers: [InventoryRequestController, InventoryDispatchController],

  providers: [
    InventoryMasterService,
    InventoryRequestService,
    InventoryDispatchService,
  ],

  exports: [
    InventoryMasterService,
    InventoryRequestService,
    InventoryDispatchService,
  ],
})
export class InventoryModule {}
