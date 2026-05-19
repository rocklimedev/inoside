import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { BoqService } from './boq.service';
import { BoqController } from './boq.controller';

// ================= MODELS =================

import { Unit } from './models/unit.model';
import { BoqCategory } from './models/boq-category.model';
import { Boq } from './models/boq.model';
import { BoqSection } from './models/boq-section.model';
import { BoqSubHeading } from './models/boq-subheading.model';
import { BoqItem } from './models/boq-item.model';

// ✅ FIXED IMPORT (IMPORTANT)
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
  providers: [BoqService],
  exports: [BoqService],
})
export class BoqModule {}
