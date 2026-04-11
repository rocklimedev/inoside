// src/attachments/attachments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';

import { Attachment } from './entities/attachments.entity';
import { DesignUpload } from './entities/design-upload.entity';
import { ExecutionDrawing } from './entities/execution-drawing.entity';

import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment, DesignUpload, ExecutionDrawing]),
    ProjectsModule, // for project validation
  ],
  controllers: [AttachmentsController],
  providers: [AttachmentsService],

  // ✅ EXPORT BOTH
  exports: [
    AttachmentsService,
    TypeOrmModule, // 🔥 critical for AttachmentRepository reuse
  ],
})
export class AttachmentsModule {}
