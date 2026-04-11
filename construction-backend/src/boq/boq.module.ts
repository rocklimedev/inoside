// src/boq/boq.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoqService } from './boq.service';
import { BoqController } from './boq.controller';
import { BoqVersion } from './entities/boq-version.entity';
import { BoqItem } from './entities/boq-item.entity';
import { ProjectsModule } from '../projects/projects.module'; // ← Add this

@Module({
  imports: [
    TypeOrmModule.forFeature([BoqVersion, BoqItem]),
    ProjectsModule, // ← Important for ProjectsService
  ],
  controllers: [BoqController],
  providers: [BoqService],
  exports: [BoqService],
})
export class BoqModule {}
