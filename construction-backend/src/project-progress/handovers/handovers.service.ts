import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Handover } from './entities/handover.entity';
import { CreateHandoverDto } from './dto/create-handover.dto';
import { UpdateHandoverDto } from './dto/udpate-handover.dto';
import { Project } from '../../projects/entities/project.entity';
import { Attachment } from '@/attachments/entities/attachments.entity';
@Injectable()
export class HandoversService {
  constructor(
    @InjectRepository(Handover)
    private readonly handoverRepo: Repository<Handover>,

    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
  ) {}

  async create(dto: CreateHandoverDto) {
    const project = await this.projectRepo.findOneBy({ id: dto.project_id });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Optional: Validate attachments exist
    if (dto.handover_pdf_id) {
      const pdfExists = await this.attachmentRepo.findOneBy({
        id: dto.handover_pdf_id,
      });
      if (!pdfExists)
        throw new NotFoundException('Handover PDF attachment not found');
    }
    if (dto.drawings_zip_id) {
      const zipExists = await this.attachmentRepo.findOneBy({
        id: dto.drawings_zip_id,
      });
      if (!zipExists)
        throw new NotFoundException('Drawings ZIP attachment not found');
    }

    const handover = this.handoverRepo.create(dto);
    return this.handoverRepo.save(handover);
  }

  async findByProject(projectId: string) {
    return this.handoverRepo.findOne({
      where: { project_id: projectId },
      relations: ['handoverPdf', 'drawingsZip', 'project'],
    });
  }

  async findOne(id: string) {
    const handover = await this.handoverRepo.findOne({
      where: { id },
      relations: ['handoverPdf', 'drawingsZip', 'project'],
    });

    if (!handover) {
      throw new NotFoundException('Handover not found');
    }
    return handover;
  }

  async update(id: string, updateDto: UpdateHandoverDto) {
    await this.findOne(id); // existence check

    // Re-validate attachments if provided
    if (updateDto.handover_pdf_id) {
      const pdf = await this.attachmentRepo.findOneBy({
        id: updateDto.handover_pdf_id,
      });
      if (!pdf) throw new NotFoundException('Handover PDF not found');
    }
    if (updateDto.drawings_zip_id) {
      const zip = await this.attachmentRepo.findOneBy({
        id: updateDto.drawings_zip_id,
      });
      if (!zip) throw new NotFoundException('Drawings ZIP not found');
    }

    await this.handoverRepo.update(id, updateDto);
    return this.findOne(id);
  }

  async signHandover(id: string, signer: 'client' | 'firm') {
    const handover = await this.findOne(id);

    const now = new Date();

    if (signer === 'client') {
      handover.client_signed_at = now;
    } else if (signer === 'firm') {
      handover.firm_signed_at = now;
    }

    // Auto confirm completion when both signed
    if (handover.client_signed_at && handover.firm_signed_at) {
      handover.completion_confirmation = true;
    }

    return this.handoverRepo.save(handover);
  }

  async remove(id: string) {
    const handover = await this.findOne(id);
    return this.handoverRepo.remove(handover);
  }
}
