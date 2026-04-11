// src/handovers/handovers.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Handover } from './entities/handover.entity';
import { HandoversService } from './handovers.service';
import { HandoversController } from './handovers.controller';
import { ProjectsModule } from '@/projects/projects.module';
import { AttachmentsModule } from '@/attachments/attachments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Handover]),

    // ✅ THIS FIXES YOUR CURRENT ERROR
    ProjectsModule,
    AttachmentsModule,
  ],
  controllers: [HandoversController],
  providers: [HandoversService],
})
export class HandoversModule {}
