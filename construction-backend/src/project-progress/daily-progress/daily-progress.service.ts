import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyProgressReport } from './entities/daily-progress.report.entity';
import { CreateDailyProgressReportDto } from './dto/create-daily-progress.dto';
import { Project } from '../../projects/entities/project.entity';

@Injectable()
export class DailyProgressService {
  constructor(
    @InjectRepository(DailyProgressReport)
    private readonly reportRepo: Repository<DailyProgressReport>,

    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async create(dto: CreateDailyProgressReportDto) {
    const project = await this.projectRepo.findOneBy({ id: dto.project_id });
    if (!project) throw new NotFoundException('Project not found');

    const report = this.reportRepo.create(dto);
    return this.reportRepo.save(report);
  }

  async findAllByProject(projectId: string) {
    return this.reportRepo.find({
      where: { project_id: projectId },
      order: { report_date: 'DESC' },
      relations: ['creator'],
    });
  }

  async findOne(id: string) {
    const report = await this.reportRepo.findOne({
      where: { id },
      relations: ['creator', 'project'],
    });
    if (!report) throw new NotFoundException('Daily progress report not found');
    return report;
  }

  async update(id: string, updateDto: Partial<CreateDailyProgressReportDto>) {
    await this.findOne(id); // check existence
    await this.reportRepo.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const report = await this.findOne(id);
    return this.reportRepo.remove(report);
  }
}
