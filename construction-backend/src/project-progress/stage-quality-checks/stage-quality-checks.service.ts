import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StageQualityCheck } from './entities/stage-quality-check.entity';
import { CreateStageQualityCheckDto } from './dto/create-stage-quality-check.dto';
import { UpdateStageQualityCheckDto } from './dto/update-stage-quality-check.dto';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class StageQualityChecksService {
  constructor(
    @InjectRepository(StageQualityCheck)
    private readonly checkRepo: Repository<StageQualityCheck>,

    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateStageQualityCheckDto) {
    const project = await this.projectRepo.findOneBy({ id: dto.project_id });
    if (!project) throw new NotFoundException('Project not found');

    if (dto.checked_by) {
      const user = await this.userRepo.findOneBy({ id: dto.checked_by });
      if (!user) throw new NotFoundException('Checker user not found');
    }

    const qualityCheck = this.checkRepo.create(dto);
    return this.checkRepo.save(qualityCheck);
  }

  async findAllByProject(projectId: string) {
    return this.checkRepo.find({
      where: { project_id: projectId },
      order: { checked_at: 'DESC' },
      relations: ['checker'],
    });
  }

  async findOne(id: string) {
    const check = await this.checkRepo.findOne({
      where: { id },
      relations: ['checker', 'project'],
    });

    if (!check) throw new NotFoundException('Stage quality check not found');
    return check;
  }

  async update(id: string, updateDto: UpdateStageQualityCheckDto) {
    const check = await this.findOne(id);

    if (updateDto.project_id) {
      const project = await this.projectRepo.findOneBy({
        id: updateDto.project_id,
      });
      if (!project) throw new NotFoundException('Project not found');
    }

    if (updateDto.checked_by) {
      const user = await this.userRepo.findOneBy({ id: updateDto.checked_by });
      if (!user) throw new NotFoundException('Checker user not found');
    }

    Object.assign(check, updateDto);
    return this.checkRepo.save(check);
  }

  async remove(id: string) {
    const check = await this.findOne(id);
    return this.checkRepo.remove(check);
  }
}
