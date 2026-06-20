import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { BoqController } from './boq.controller';

import { BoqService } from './boq.service';
import { BoqCategoryService } from './services/boq-category.service';
import { BoqSectionService } from './services/boq-section.service';
import { BoqSubHeadingService } from './services/boq-subheading.service';
import { BoqItemService } from './services/boq-item.service';

// ================= MODELS =================

import { Unit } from './models/unit.model';
import { BoqCategory } from './models/boq-category.model';
import { Boq } from './models/boq.model';
import { BoqSection } from './models/boq-section.model';
import { BoqSubHeading } from './models/boq-subheading.model';
import { BoqItem } from './models/boq-item.model';

import { InventoryMaster } from '@/modules/inventory/models/inventory-master.model';
import { Brand } from '@/modules/inventory/models/brand.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      // ================= BOQ =================
      Unit,
      BoqCategory,
      Boq,
      BoqSection,
      BoqSubHeading,
      BoqItem,

      // ================= INVENTORY =================
      InventoryMaster,
      Brand,
    ]),
  ],
  controllers: [BoqController],
  providers: [
    BoqService,
    BoqCategoryService,
    BoqSectionService,
    BoqSubHeadingService,
    BoqItemService,
  ],
  exports: [
    BoqService,
    BoqCategoryService,
    BoqSectionService,
    BoqSubHeadingService,
    BoqItemService,
  ],
})
export class BoqModule {}
