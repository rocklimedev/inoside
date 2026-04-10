// attachments.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Attachment } from './entities/attachments.entity';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

import { AttachmentEntityType } from './entities/attachments.entity';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly repo: Repository<Attachment>,
  ) {}

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
    });
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}
