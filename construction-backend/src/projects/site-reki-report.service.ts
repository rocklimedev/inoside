// src/projects/site-reki-report.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteRekiReport } from './entities/site-reki-report.entity';
import { CreateSiteRekiReportDto } from './dto/create-site-reki-report.dto';
import { UpdateSiteRekiReportDto } from './dto/update-site-reki-report.dto';
@Injectable()
export class SiteRekiReportService {
  constructor(
    @InjectRepository(SiteRekiReport)
    private readonly repo: Repository<SiteRekiReport>,
  ) {}

  async create(
    project_id: string,
    dto: CreateSiteRekiReportDto,
    supervisorId: string,
  ) {
    const report = this.repo.create({
      project_id,
      supervisor_id: supervisorId,
      ...dto,
    });
    return this.repo.save(report);
  }

  async findByProject(project_id: string) {
    return this.repo.findOne({
      where: { project_id },
      relations: ['supervisor'],
    });
  }

  async update(id: string, dto: UpdateSiteRekiReportDto) {
    const report = await this.repo.findOne({ where: { id } });
    if (!report) throw new NotFoundException('Site reki report not found');

    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id }, relations: ['supervisor'] });
  }
}
