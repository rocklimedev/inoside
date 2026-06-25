import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DailyProgressReport } from '../models/daily-progress-report.model';
import { CreateDailyProgressReportDto } from '../dto/create-daily-progress-report.dto';
import { UpdateDailyProgressReportDto } from '../dto/update-daily-progress-report.dto';

@Injectable()
export class DailyProgressReportsService {
  constructor(
    @InjectRepository(DailyProgressReport)
    private readonly repo: Repository<DailyProgressReport>,
  ) {}

  // ======================================================
  // CREATE
  // ======================================================
  async create(dto: CreateDailyProgressReportDto) {
    const report = this.repo.create({
      ...dto,
    });

    return await this.repo.save(report);
  }

  // ======================================================
  // FIND ALL (OPTIMIZED)
  // ======================================================
  async findAll() {
    return await this.repo.find({
      relations: {
        project: true,
        supervisor: true,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  // ======================================================
  // FIND ONE (SAFE + REUSABLE)
  // ======================================================
  async findOne(id: string) {
    const report = await this.repo.findOne({
      where: { id },
      relations: {
        project: true,
        supervisor: true,
      },
    });

    if (!report) {
      throw new NotFoundException(`Daily progress report not found: ${id}`);
    }

    return report;
  }

  // ======================================================
  // UPDATE (SAFE PATCH STYLE)
  // ======================================================
  async update(id: string, dto: UpdateDailyProgressReportDto) {
    const report = await this.findOne(id);

    // Prevent accidental relation overwrite
    const { project_id, supervisor_id, ...safeData } = dto as any;

    Object.assign(report, safeData);

    return await this.repo.save(report);
  }

  // ======================================================
  // DELETE (OPTIMIZED)
  // ======================================================
  async remove(id: string) {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Report not found: ${id}`);
    }

    return {
      success: true,
      message: 'Report deleted successfully',
    };
  }
}
