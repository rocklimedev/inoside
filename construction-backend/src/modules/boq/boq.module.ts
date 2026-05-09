import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BoqService } from './boq.service';
import { BoqController } from './boq.controller';

// Models
import { Unit } from './models/unit.model';
import { BoqCategory } from './models/boq-category.model';
import { Boq } from './models/boq.model';
import { BoqSection } from './models/boq-section.model';
import { BoqItem } from './models/boq-item.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Unit, BoqCategory, Boq, BoqSection, BoqItem]),
  ],
  controllers: [BoqController],
  providers: [BoqService],
  exports: [BoqService],
})
export class BoqModule {}
