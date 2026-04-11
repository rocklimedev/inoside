import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Attachment } from './entities/attachments.entity';
import { DesignUpload } from './entities/design-upload.entity';
import { ExecutionDrawing } from './entities/execution-drawing.entity';

import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { CreateDesignUploadDto } from './dto/create-design-upload.dto';
import { CreateExecutionDrawingDto } from './dto/create-execution-drawing.dto';
import { AttachmentEntityType } from './entities/attachments.entity';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly repo: Repository<Attachment>,

    @InjectRepository(DesignUpload)
    private readonly designRepo: Repository<DesignUpload>,

    @InjectRepository(ExecutionDrawing)
    private readonly executionRepo: Repository<ExecutionDrawing>,
  ) {}

  // ====================== GENERIC ATTACHMENTS ======================
  async create(dto: CreateAttachmentDto, userId: string) {
    const attachment = this.repo.create({
      ...dto,
      uploaded_by: userId,
    });
    return this.repo.save(attachment);
  }

  async findByEntity(entity_type: AttachmentEntityType, entity_id: string) {
    return this.repo.find({
      where: { entity_type, entity_id },
      order: { uploaded_at: 'DESC' },
      relations: ['uploader'],
    });
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }

  // ====================== DESIGN UPLOADS ======================
  async createDesignUpload(
    project_id: string,
    dto: CreateDesignUploadDto,
    uploadedBy: string,
  ) {
    const design = this.designRepo.create({
      project_id,
      uploaded_by: uploadedBy,
      ...dto,
    });
    return this.designRepo.save(design);
  }

  async findDesignByProject(project_id: string) {
    return this.designRepo.find({
      where: { project_id },
      relations: ['uploader'],
      order: { created_at: 'DESC' },
    });
  }

  // ====================== EXECUTION DRAWINGS ======================
  async createExecutionDrawing(
    project_id: string,
    dto: CreateExecutionDrawingDto,
    uploadedBy: string,
  ) {
    const drawing = this.executionRepo.create({
      project_id,
      uploaded_by: uploadedBy,
      ...dto,
    });
    return this.executionRepo.save(drawing);
  }

  async findExecutionByProject(project_id: string) {
    return this.executionRepo.find({
      where: { project_id },
      relations: ['uploader'],
      order: { created_at: 'DESC' },
    });
  }
}
