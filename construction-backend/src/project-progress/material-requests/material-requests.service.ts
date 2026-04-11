import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialRequest } from './entities/material-reuest.entity';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';
import { UpdateMaterialRequestDto } from './dto/update-material-request.dto';
import { UpdateMaterialRequestStatusDto } from './dto/update-status.dto';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class MaterialRequestsService {
  constructor(
    @InjectRepository(MaterialRequest)
    private readonly requestRepo: Repository<MaterialRequest>,

    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateMaterialRequestDto) {
    // Validate project if provided
    if (dto.project_id) {
      const project = await this.projectRepo.findOneBy({ id: dto.project_id });
      if (!project) throw new NotFoundException('Project not found');
    }

    // Validate requester if provided
    if (dto.requested_by) {
      const user = await this.userRepo.findOneBy({ id: dto.requested_by });
      if (!user) throw new NotFoundException('Requester user not found');
    }

    const materialRequest = this.requestRepo.create(dto);
    return this.requestRepo.save(materialRequest);
  }

  async findAllByProject(projectId: string) {
    return this.requestRepo.find({
      where: { project_id: projectId },
      order: { created_at: 'DESC' },
      relations: ['requester', 'project'],
    });
  }

  async findAll() {
    return this.requestRepo.find({
      order: { created_at: 'DESC' },
      relations: ['requester', 'project'],
    });
  }

  async findOne(id: string) {
    const request = await this.requestRepo.findOne({
      where: { id },
      relations: ['requester', 'project'],
    });

    if (!request) throw new NotFoundException('Material request not found');
    return request;
  }

  async update(id: string, updateDto: UpdateMaterialRequestDto) {
    const request = await this.findOne(id);

    if (updateDto.project_id) {
      const project = await this.projectRepo.findOneBy({
        id: updateDto.project_id,
      });
      if (!project) throw new NotFoundException('Project not found');
    }

    if (updateDto.requested_by) {
      const user = await this.userRepo.findOneBy({
        id: updateDto.requested_by,
      });
      if (!user) throw new NotFoundException('Requester not found');
    }

    Object.assign(request, updateDto);
    return this.requestRepo.save(request);
  }

  async updateStatus(id: string, statusDto: UpdateMaterialRequestStatusDto) {
    const request = await this.findOne(id);
    request.status = statusDto.status;
    return this.requestRepo.save(request);
  }

  async remove(id: string) {
    const request = await this.findOne(id);
    return this.requestRepo.remove(request);
  }
}
